from datetime import datetime, timedelta
from django.utils import timezone

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework import serializers


from server.utilities import get_working_hours
from meetings.models import Meeting, ServiceData
from accounts.models import Account, Customer, Barber
from data.models import Data, Notification


class ServiceDataSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='service.id')

    class Meta:
        model = ServiceData
        fields = ('barber', 'id')


class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.PrimaryKeyRelatedField(queryset=Barber.objects.all())
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    barber_last_name = serializers.ReadOnlyField(source='barber.last_name')
    # services = serializers.PrimaryKeyRelatedField(
    #     queryset=Service.objects.all(), many=True, allow_null=True, required=False)
    services = ServiceDataSerializer(source='services_data', many=True)
    blocked = serializers.SerializerMethodField('get_blocked')

    def get_blocked(self, obj):
        return not(obj.customer) and not(obj.services.exists())

    def validate(self, data, pass_cached_data=False):
        # Cannot create meeting WHEN it's not between 2 slots, but maybe in the middle of them []
        cms_data = Data.objects.first()

        # Get meetings in the same slot
        same_slot_meetings = Meeting.objects.filter(
            start__lte=data['start'], end__gt=data['start']).exclude(id=self.context.get('meeting_id')).select_related('barber')

        working_hours = get_working_hours(data['start'].weekday())
        start_meeting = int(data['start'].hour) * 60 + int(data['start'].minute)

        if (data['end'] < data['start']):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        # Validate meeting date
        if data['start'] < timezone.now() + timedelta(minutes=15):
            raise serializers.ValidationError(
                {'detail': 'Nie można umówić wizyty krócej niż 15min przed jej rozpoczęciem'})

        # Validate if meeting is NOT between work hours and validate meeting work_time
        if working_hours['is_non_working_hour'] or ((data['end'] - data['start']).seconds % 3600) // 60 < cms_data.work_time or start_meeting < working_hours['start'] or start_meeting > working_hours['end'] - cms_data.work_time:
            raise serializers.ValidationError('Nie poprawna data wizyty')

        # Validate if barber is occupied
        for barber in same_slot_meetings.values_list('barber__slug', flat=True):
            if barber == data['barber'].slug:
                raise serializers.ValidationError({'detail': 'Nie umówić wizyty z zablokowanym fryzjerem'})

        if pass_cached_data:
            data['same_slot_meeting_count'] = same_slot_meetings.count()
            data['one_slot_max_meetings'] = cms_data.one_slot_max_meetings

        return data

    def create(self, validated_data):
        if (validated_data['services']):
            meeting_duration = 0

            for serivce in validated_data['services']:
                try:
                    meeting_duration += validated_data['barber'].service_barber_data.get(service=serivce).time
                except:
                    meeting_duration += serivce.time

            validated_data['end'] = validated_data['start'] + timedelta(minutes=meeting_duration)

        return super(MeetingSerializer, self).create(self, validated_data)

    class Meta:
        model = Meeting
        fields = (
            'id',
            'barber',
            'barber_first_name',
            'barber_last_name',
            'customer',
            'start',
            'end',
            'services',
            'confirmed',
            'blocked',
        )
        read_only_fields = ('id',)


class CustomerMeetingSerializer(MeetingSerializer):
    customer = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def validate(self, data):
        data = super(CustomerMeetingSerializer, self).validate(data, True)

        if not(data['services']):
            raise serializers.ValidationError({'detail': 'Musisz wybrać usługę'})

        # Validate same slot meeting count
        if data['same_slot_meeting_count'] >= data['one_slot_max_meetings']:
            raise serializers.ValidationError({'detail': 'Nie porawna ilość wizyt w jednym czasie'})

        del data['same_slot_meeting_count']
        del data['one_slot_max_meetings']

        return data

    def create(self, validated_data):
        user = self.context.get('request').user
        validated_data['confirmed'] = True

        user.bookings += 1
        user.revenue += round(sum(service.price for service in validated_data['services']))
        user.save()

        # Send notfiy
        meeting = super(CustomerMeetingSerializer, self).create(validated_data)
        admins = Account.objects.filter(is_admin=True)
        channel_layer = get_channel_layer()

        notify = Notification.objects.create(
            title=f'{user} umówił wizytę',
            message=f"""
                {user} umówił wizytę na dzień {datetime.strftime(validated_data['start'], '%d.%m.%Y')}
                o godzinie {datetime.strftime(validated_data['start'], '%H:%M')},
                Aby potwierdzić jej istnienie, kliknij w przycisk "Potwierdź" poniżej
            """,
            meeting=meeting
        )
        notify.save()
        notify.recivers.add(*admins)

        for admin in admins:
            async_to_sync(channel_layer.group_send)(admin.room_name, {
                'type': 'send_data',
                'event': 'GET_NOTIFICATION',
                'payload': notify.id,
            })

        return meeting

    def update(self, instance, validated_data):
        confirmed = instance.confirmed
        instance = super(CustomerMeetingSerializer, self).update(instance, validated_data)

        if not(confirmed) and validated_data.get('confirmed'):
            user = instance.customer

            user.bookings += 1
            user.revenue += round(sum(service.price for service in validated_data['services']))
            user.save()

        return instance

    def to_representation(self, instance):
        data = super(CustomerMeetingSerializer, self).to_representation(instance)
        data['customer'] = instance.customer_id

        return data


class AdminMeetingSerializer(MeetingSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), allow_null=True)
    customer_first_name = serializers.ReadOnlyField(source='customer.first_name')
    customer_last_name = serializers.ReadOnlyField(source='customer.last_name')

    def validate(self, data):
        data = super(AdminMeetingSerializer, self).validate(data, True)

        # Validate same slot meeting count
        # if (data['same_slot_meeting_count'] >= data['one_slot_max_meetings'] and not(data.get('do_not_work'))) or \
        #         (data['same_slot_meeting_count'] > data['one_slot_max_meetings'] and data.get('do_not_work')):
        #     raise serializers.ValidationError({'detail': 'Nie porawna ilość wizyt w jednym czasie'})

        del data['same_slot_meeting_count']
        del data['one_slot_max_meetings']

        return data

    def create(self, validated_data):
        if (validated_data['end'] - validated_data['start']).days > 0 or validated_data['end'].hour == 0:
            # If meeting should be allDay then add 1 day to it.
            validated_data['end'] += timedelta(days=1)

        meeting = super(AdminMeetingSerializer, self).create(validated_data)
        customer = validated_data['customer']

        if customer:
            channel_layer = get_channel_layer()

            notify = Notification.objects.create(
                title='Została umówiona wizyta',
                message=f"""
                    Do salonu Damian Kwiecień została umówiona wizyta na dzień {datetime.strftime(validated_data['start'], '%d.%m.%Y')}
                    o godzinie {datetime.strftime(validated_data['start'], '%H:%M')}.
                    Aby potwierdzić jej istnienie, kliknij w przycisk "Potwierdź" poniżej
                """,
                meeting=meeting
            )
            notify.save()
            notify.recivers.add(customer)

            async_to_sync(channel_layer.group_send)(customer.room_name, {
                'type': 'send_data',
                'event': 'GET_NOTIFICATION',
                'payload': notify.id,
            })

        return meeting

    def update(self, instance, validated_data):
        prev_customer = instance.customer
        customer = validated_data['customer']

        if customer and not(prev_customer == customer):
            channel_layer = get_channel_layer()

            # New customer notify
            notify = Notification.objects.create(
                title='Została umówiona wizyta',
                message=f"""
                    Do salonu Damian Kwiecień została umówiona wizyta na dzień {datetime.strftime(validated_data['start'], '%d.%m.%Y')}
                    o godzinie {datetime.strftime(validated_data['start'], '%H:%M')}.
                    Aby potwierdzić jej istnienie, kliknij w przycisk "Potwierdź" poniżej
                """,
                meeting=instance
            )
            notify.save()
            notify.recivers.add(customer)

            async_to_sync(channel_layer.group_send)(customer.room_name, {
                'type': 'send_data',
                'event': 'GET_NOTIFICATION',
                'payload': notify.id,
            })

            # Previous customer notify
            notify = Notification.objects.create(
                title='Odmówiono wizytę',
                message=f"""
                    Została odmówiona wizyta z dnia {datetime.strftime(validated_data['start'], '%d.%m.%Y')}
                    o godzinie {datetime.strftime(validated_data['start'], '%H:%M')}.
                    W celu więcej informacji prosimy o kontakt
                """,
            )
            notify.save()
            notify.recivers.add(prev_customer)

            async_to_sync(channel_layer.group_send)(prev_customer.room_name, {
                'type': 'send_data',
                'event': 'GET_NOTIFICATION',
                'payload': notify.id,
            })

        return super().update(instance, validated_data)

    class Meta(MeetingSerializer.Meta):
        fields = (
            *MeetingSerializer.Meta.fields,
            'customer_first_name',
            'customer_last_name',
            'description',
        )

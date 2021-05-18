from datetime import timedelta
from django.utils import timezone

from rest_framework import serializers
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


from server.utilities import get_working_hours
from meetings.models import Meeting
from accounts.models import Account
from data.models import Data, Notification


class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=True), slug_field='slug', allow_null=True)
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    barber_last_name = serializers.ReadOnlyField(source='barber.last_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    def validate(self, data, pass_cached_data=False):
        # Cannot create meeting WHEN it's not between 2 slots, but maybe in the middle of them []

        server_data = Data.objects.first()

        # Get meetings in the same slot
        same_slot_meetings = Meeting.objects.filter(
            start__lte=data['start'], end__gt=data['start']).exclude(id=self.context.get('meeting_id')).select_related('barber')

        working_hours = get_working_hours(data['start'].weekday())
        start_meeting = int(data['start'].hour) * 60 + int(data['start'].minute)

        if not(data['type'] == Meeting.TYPES[2][0]):
            if not(data['barber']):
                raise serializers.ValidationError('Fryzjer jest wymagany')

        if (data['end'] < data['start']):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        # Validate meeting date
        if data['start'] < timezone.now() + timedelta(minutes=15):
            raise serializers.ValidationError(
                {'detail': 'Nie można umówić wizyty krócej niż 15min przed jej rozpoczęciem'})

        # Validate if meeting is NOT between work hours and validate meeting work_time
        if not(data['type'] == Meeting.TYPES[2][0]) and (working_hours['is_non_working_hour'] or ((data['end'] - data['start']).seconds % 3600) // 60 < server_data.work_time or start_meeting < working_hours['start'] or start_meeting > working_hours['end'] - server_data.work_time):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        # Validate if barber is occupied
        if not(data['type'] == Meeting.TYPES[2][0]) and not(data['barber'] == ''):
            for barber in same_slot_meetings.values_list('barber__slug', flat=True):
                if barber == data['barber'].slug:
                    raise serializers.ValidationError({'detail': 'Nie umówić wizyty z nieczynnym fryzjerem'})

        if pass_cached_data:
            data['same_slot_meeting_count'] = same_slot_meetings.count()
            data['one_slot_max_meetings'] = server_data.one_slot_max_meetings

        return data

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
            'type',
            'do_not_work',
            'customer_first_name',
            'customer_last_name',
            'customer_phone_number',
            'customer_fax_number',
            'confirmed'
        )
        read_only_fields = ('id', 'do_not_work',)


class CustomerMeetingSerializer(MeetingSerializer):
    customer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    type = serializers.ChoiceField(choices=Meeting.TYPES[:2], write_only=True, allow_null=True)

    def validate(self, data):
        data = super(CustomerMeetingSerializer, self).validate(data, True)

        # Validate same slot meeting count
        if data['same_slot_meeting_count'] >= data['one_slot_max_meetings']:
            raise serializers.ValidationError({'detail': 'Nie porawna ilość wizyt w jednym czasie'})

        del data['same_slot_meeting_count']
        del data['one_slot_max_meetings']

        return data

    def create(self, data):
        user = self.context.get('request').user
        server_data = Data.objects.first()

        data['customer_first_name'] = user.first_name
        data['customer_last_name'] = user.last_name
        data['customer_phone_number'] = user.phone_number
        data['customer_fax_number'] = user.fax_number
        data['confirmed'] = True

        user.bookings += 1
        user.revenue += round(getattr(server_data, f"{data['type']}_price"))
        user.save()

        return super(CustomerMeetingSerializer, self).create(data)

    def update(self, instance, data):
        confirmed = instance.confirmed
        instance = super(CustomerMeetingSerializer, self).update(instance, data)

        if not(instance.type == Meeting.TYPES[2][0]) and not(confirmed) and data.get('confirmed'):
            user = instance.customer
            server_data = Data.objects.first()

            user.bookings += 1
            user.revenue += round(getattr(server_data, f"{data['type']}_price"))
            user.save()

        return instance

    class Meta(MeetingSerializer.Meta):
        fields = (
            *MeetingSerializer.Meta.fields,
            'customer_id',
        )

        extra_kwargs = {
            'customer_first_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_last_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_phone_number': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_fax_number': {'write_only': True},
        }


class AdminMeetingSerializer(MeetingSerializer):
    customer = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=False), slug_field='slug', allow_null=True)
    type = serializers.ChoiceField(choices=Meeting.TYPES, write_only=True, allow_null=True)

    def validate(self, data):
        data = super(AdminMeetingSerializer, self).validate(data, True)

        if not(data['type'] == Meeting.TYPES[2][0]):
            if len(data['customer_first_name']) < 3:
                raise serializers.ValidationError('Imię musi mieć conajmniej 3 znaki')
            if len(data['customer_last_name']) < 3:
                raise serializers.ValidationError('Nazwisko musi mieć conajmniej 3 znaki')
            if not(data['customer_phone_number']):
                raise serializers.ValidationError('Numer telefonu jest wymagany')

        # Validate same slot meeting count
        if (data['same_slot_meeting_count'] >= data['one_slot_max_meetings'] and not(data['type'] == Meeting.TYPES[2][0])) or \
                (data['same_slot_meeting_count'] > data['one_slot_max_meetings'] and data['type'] == Meeting.TYPES[2][0]):
            raise serializers.ValidationError({'detail': 'Nie porawna ilość wizyt w jednym czasie'})

        del data['same_slot_meeting_count']
        del data['one_slot_max_meetings']

        return data

    def create(self, data):
        if (data['end'] - data['start']).days > 0 or data['end'].hour == 0:
            # If meeting should be allDay then add 1 day to it.
            data['end'] += timedelta(days=1)

        if data.get('customer'):
            channel_layer = get_channel_layer()

            notify = Notification.objects.create(
                title='Została umówiona wizyta', message='Wizyta do salonu Damian Kwiecień została umówiona. Aby potwierdzić jej istnienie, kliknij `tutaj`')
            notify.save()
            notify.recivers.add(data['customer'])

            for reciver in notify.recivers.all():
                async_to_sync(channel_layer.group_send)(reciver.room_name, {
                    'type': 'send_data',
                    'event': 'GET_NOTIFICATION',
                    'payload': notify.id,
                })

        return super(AdminMeetingSerializer, self).create(data)

    def to_representation(self, instance):
        data = super(AdminMeetingSerializer, self).to_representation(instance)
        data['type'] = instance.get_type_display()
        return data

    class Meta(MeetingSerializer.Meta):
        extra_kwargs = {
            'customer_first_name': {'required': False, 'allow_blank': True},
            'customer_last_name': {'required': False, 'allow_blank': True},
            'customer_phone_number': {'required': False, 'allow_blank': True},
        }

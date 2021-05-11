import pytz
from datetime import timedelta

from django.db.models import Q
from django.utils import timezone

from rest_framework import serializers

from server.utilities import get_working_hours
from meetings.models import Meeting
from accounts.models import Account
from data.models import Data
from accounts.api.serializers import AccountSerializer


class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=True), slug_field='slug', allow_null=True)
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    barber_last_name = serializers.ReadOnlyField(source='barber.last_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    def validate(self, data):
        if not(data['type'] == Meeting.TYPES[2][0]):
            if not(data['barber']):
                raise serializers.ValidationError('Fryzjer jest wymagany')

        if (data['end'] < data['start']):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        return data

    def create(self, data):
        if (data['end'] - data['start']).days > 0 or data['end'].hour == 0:
            # If meeting should be allDay then add 1 day to it.
            data['end'] += timedelta(days=1)

        return Meeting.objects.create(**data)

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
        )
        read_only_fields = ('id', 'do_not_work',)


class CustomerMeetingSerializer(MeetingSerializer):
    customer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    type = serializers.ChoiceField(choices=Meeting.TYPES[:2], write_only=True, allow_null=True)

    def validate(self, data):
        # Cannot add meeting on non working hour []
        # Cannot add meeting when there are more than `one_slot_max_meetings` []
        # Cannot add meeting 15 minutes before meeting [x]
        # Cannot add meeting that is longer than work_time []
        # Cannot add meeting with the occupied barber []
        # Ca

        one_slot_max_meetings = Data.objects.first().one_slot_max_meetings

        x = Meeting.objects.filter(
            Q(start__gte=data['start']) & Q(end__lte=data['end']) |
            Q(start__lte=data['start']) & Q(end__gte=data['end']) |
            Q(start__gte=data['start']) & Q(end__gt=data['end']) |
            Q(start__lte=data['start']) & Q(end__lt=data['end'])
        ).count()

        if x:
            #  > int(one_slot_max_meetings)
            print(x)

        if data['start'] < timezone.now() + timedelta(minutes=15):
            raise serializers.ValidationError('Wizytę można umówic tylko wcześniej niż 15min przed rozpoczęciem')

        return super(CustomerMeetingSerializer, self).validate(data)

    def create(self, data):
        user = self.context.get('request').user
        data['customer_first_name'] = user.first_name
        data['customer_last_name'] = user.last_name
        data['customer_phone_number'] = user.phone_number
        data['customer_fax_number'] = user.fax_number

        return Meeting.objects.create(**data)

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
        work_time = Data.objects.first().work_time
        # if data['start'] < timezone.now() - timedelta(hours=1):
        #     raise serializers.ValidationError('Wizyta nie może odbyć się wcześniej niż 1 godzinę temu')

        if not(data['type'] == Meeting.TYPES[2][0]):
            if len(data['customer_first_name']) < 3:
                raise serializers.ValidationError('Imię musi mieć conajmniej 3 znaki')
            if len(data['customer_last_name']) < 3:
                raise serializers.ValidationError('Nazwisko musi mieć conajmniej 3 znaki')
            if not(data['customer_phone_number']):
                raise serializers.ValidationError('Numer telefonu jest wymagany')

        working_hours = get_working_hours(data['start'].weekday())
        start_meeting = int(data['start'].hour) * 60 + int(data['start'].minute)

        # Check if meeting is not between work hours
        if (not(data['type'] == Meeting.TYPES[2][0]) and (working_hours['is_non_working_hour'] or ((data['end'] - data['start']).seconds % 3600) // 60 < work_time or start_meeting < working_hours['start'] or start_meeting > working_hours['end'] - work_time)):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        # Check if there is any meeting form start to end
        x = Meeting.objects.filter(
            Q(start__gte=data['start']) & Q(end__lte=data['end']) |
            Q(start__lte=data['start']) & Q(end__gte=data['end']) |
            Q(start__gte=data['start']) & Q(end__gt=data['end']) |
            Q(start__lte=data['start']) & Q(end__lt=data['end'])
        ).count()

        if x:
            #  > int(one_slot_max_meetings)
            print(x)

        return super(AdminMeetingSerializer, self).validate(data)

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

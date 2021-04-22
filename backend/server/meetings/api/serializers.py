from meetings.models import Meeting
from accounts.models import Account
from data.models import Data
from accounts.api.serializers import AccountSerializer
from rest_framework import serializers
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
import pytz


class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=True), slug_field='slug', write_only=True, allow_null=True)
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    def validate(self, data):
        if not(data['type'] == Meeting.TYPES[2][0]):
            if len(data['customer_first_name']) < 3:
                raise serializers.ValidationError('Imię musi mieć conajmniej 3 znaki')
            if len(data['customer_last_name']) < 3:
                raise serializers.ValidationError('Nazwisko musi mieć conajmniej 3 znaki')
            if not(data['customer_phone_number']):
                raise serializers.ValidationError('Numer telefonu jest wymagany')
            if not(data['barber']):
                raise serializers.ValidationError('Fryzjer jest wymagany')

        if (data['end'] < data['start']):
            raise serializers.ValidationError('Nie poprawna data wizyty')

        return data

    class Meta:
        model = Meeting
        fields = (
            'id',
            'barber',
            'barber_first_name',
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
        read_only_fields = ('id', 'do_not_work', 'barber_first_name',)


class CustomerMeetingSerializer(MeetingSerializer):
    customer = serializers.HiddenField(default=serializers.CurrentUserDefault())
    type = serializers.ChoiceField(choices=Meeting.TYPES[:2], write_only=True, allow_null=True)

    def validate(self, data):
        one_slot_max_meetings = Account.objects.filter(is_admin=True).count()

        x = Meeting.objects.filter(
            Q(start__gte=data['start']) & Q(end__lte=data['end']) |
            Q(start__lte=data['start']) & Q(end__gte=data['end']) |
            Q(start__lte=data['start']) & Q(end__lte=data['end']) |
            Q(start__gte=data['start']) & Q(end__gte=data['end'])
        ).count()

        if x:
            #  > int(one_slot_max_meetings)
            print(x)

        if data['start'] < timezone.now() + timedelta(minutes=15):
            raise serializers.ValidationError('Wizytę można umówic tylko wcześniej niż 15min przed rozpoczęciem')

        return super(CustomerMeetingSerializer, self).validate(data)

    class Meta(MeetingSerializer.Meta):
        extra_kwargs = {
            'customer_first_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_last_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_phone_number': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_fax_number': {'write_only': True},
        }


class AdminMeetingSerializer(MeetingSerializer):
    customer = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=False), slug_field='slug', write_only=True, allow_null=True)
    type = serializers.ChoiceField(choices=Meeting.TYPES, write_only=True, allow_null=True)

    def validate(self, data):
        # if data['start'] < timezone.now() - timedelta(hours=1):
        #     raise serializers.ValidationError('Wizyta nie może odbyć się wcześniej niż 1 godzinę temu')

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

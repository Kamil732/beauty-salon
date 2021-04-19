from rest_framework import serializers

from accounts.api.serializers import AccountSerializer
from accounts.models import Account
from meetings.models import Meeting


class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=True), slug_field='slug', write_only=True, allow_null=True)
    customer = serializers.SlugRelatedField(queryset=Account.objects.filter(
        is_admin=False), slug_field='slug', write_only=True, allow_null=True)
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')
    type = serializers.ChoiceField(choices=Meeting.TYPES, write_only=True, allow_null=True)

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    def validate(self, data):
        if not(data['type'] == Meeting.TYPES[2][0]):
            if len(data['customer_first_name']) < 3:
                raise serializers.ValidationError('Pole `Imię klienta` musi mieć conajmniej 3 znaki')
            if len(data['customer_last_name']) < 3:
                raise serializers.ValidationError('Pole `Nazwisko klienta` musi mieć conajmniej 3 znaki')

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
        extra_kwargs = {
            'customer_first_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_last_name': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_phone_number': {'write_only': True, 'required': False, 'allow_blank': True},
            'customer_fax_number': {'write_only': True},
        }


class AdminMeetingSerializer(MeetingSerializer):
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

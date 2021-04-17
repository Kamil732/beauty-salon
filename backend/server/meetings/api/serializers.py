from rest_framework import serializers

from accounts.models import Account
from meetings.models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    barber = serializers.SlugRelatedField(queryset=Account.objects.filter(is_admin=True), slug_field='slug', write_only=True, allow_null=True)
    customer = serializers.SlugRelatedField(queryset=Account.objects.filter(is_admin=False), slug_field='slug', write_only=True, allow_null=True)
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')
    type = serializers.ChoiceField(choices=Meeting.TYPES, write_only=True, allow_null=True)

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    def validate(self, data):
        if not(data['type'] == Meeting.TYPES[2][0]):
            if not(data['barber']):
                raise serializers.ValidationError('Pole `fryzjer` jest wymagane')
            elif not(data['customer_first_name']):
                raise serializers.ValidationError('Pole `Imię klienta` jest wymagane')
            elif len(data['customer_first_name']) < 3:
                raise serializers.ValidationError('Pole `Imię klienta` musi mieć conajmniej 3 znaki')

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
            'customer_first_name'
        )
        read_only_fields = ('id', 'do_not_work', 'barber_first_name',)
        extra_kwargs = {
            'customer_first_name': {'write_only': True},
        }


class AdminMeetingSerializer(MeetingSerializer):
    def to_representation(self, instance):
        data = super(AdminMeetingSerializer, self).to_representation(instance)
        data['type'] = instance.get_type_display()
        return data

    class Meta(MeetingSerializer.Meta):
        extra_kwargs = {}
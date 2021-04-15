from rest_framework import serializers

from accounts.models import Account
from meetings.models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    barber_first_name = serializers.ReadOnlyField(source='barber.first_name')
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    class Meta:
        model = Meeting
        fields = ('id', 'barber_first_name', 'start', 'end', 'do_not_work',)
        read_only_fields = ('id', 'start', 'end', 'do_not_work',)

class AdminMeetingSerializer(MeetingSerializer):
    type = serializers.CharField(source='get_type_display')

    class Meta(MeetingSerializer.Meta):
        fields = (
            'id',
            'barber_first_name',
            'start',
            'end',
            'type',
            'do_not_work',
            'customer_first_name'
        )
        read_only_fields = ('id', 'start', 'end', 'do_not_work',)
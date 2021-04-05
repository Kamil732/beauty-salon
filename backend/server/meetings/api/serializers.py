from rest_framework import serializers

from meetings.models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    class Meta:
        model = Meeting
        fields = ('start', 'end', 'do_not_work',)

class AdminMeetingSerializer(MeetingSerializer):
    class Meta(MeetingSerializer.Meta):
        fields = (
            'start',
            'end',
            'type',
            'do_not_work',
            'customer_first_name'
        )
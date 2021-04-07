from rest_framework import serializers

from meetings.models import Meeting

class MeetingSerializer(serializers.ModelSerializer):
    do_not_work = serializers.SerializerMethodField('get_do_not_work')

    def get_do_not_work(self, obj):
        return obj.type == Meeting.TYPES[2][0]

    class Meta:
        model = Meeting
        fields = ('id', 'start', 'end', 'do_not_work',)

class AdminMeetingSerializer(MeetingSerializer):
    type = serializers.CharField(source='get_type_display')

    class Meta(MeetingSerializer.Meta):
        fields = (
            'id',
            'start',
            'end',
            'type',
            'do_not_work',
            'customer_first_name'
        )
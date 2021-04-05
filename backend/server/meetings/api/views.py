from rest_framework import viewsets

from server.permissions import IsAdminOrReadOnly
from meetings.models import Meeting
from . import serializers

class MeetingViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Meeting.objects.order_by('-start')

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return serializers.AdminMeetingSerializer
        return serializers.MeetingSerializer
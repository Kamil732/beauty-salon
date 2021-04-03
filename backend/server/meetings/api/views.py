from rest_framework import viewsets

from server.permissions import IsAdminOrReadOnly
from meetings.models import Meeting
from . import serializers

class MeetingViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Meeting.objects.order_by('-start')
    serializer_class = serializers.MeetingSerializer
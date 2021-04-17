from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework import viewsets, mixins

from server.permissions import IsAdminOrReadOnly
from meetings.models import Meeting
from . import serializers

# TODO: Delete old meetings after GET method
@method_decorator(csrf_protect, name='list')
@method_decorator(csrf_protect, name='update')
@method_decorator(csrf_protect, name='destroy')
class MeetingViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    viewsets.GenericViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = Meeting.objects.order_by('-start')

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return serializers.AdminMeetingSerializer
        return serializers.MeetingSerializer
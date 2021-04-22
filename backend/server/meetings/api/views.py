from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
import datetime

from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response

from server.permissions import IsOwnerOrIsAdminOrReadOnly
from meetings.models import Meeting
from meetings.api import serializers


@method_decorator(csrf_protect, name='create')
class MeetingListAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return serializers.AdminMeetingSerializer
        return serializers.CustomerMeetingSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        data = []

        for meeting in queryset:
            serializer = serializers.AdminMeetingSerializer(meeting, many=False) if self.request.user.is_authenticated and (
                self.request.user.is_admin or meeting.customer == self.request.user) else serializers.CustomerMeetingSerializer(meeting, many=False)

            data.append(serializer.data)

        return Response(data)

    def get_queryset(self):
        # Get date start of week
        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())

        from_ = self.request.query_params.get('from', monday)
        to = self.request.query_params.get('to', monday + datetime.timedelta(days=7))

        return Meeting.objects.filter(start__gte=from_, start__lte=to)


@method_decorator(csrf_protect, name='dispatch')
class MeetingDetailAPIView(generics.UpdateAPIView, generics.DestroyAPIView):
    permission_classes = (IsOwnerOrIsAdminOrReadOnly,)
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'meeting_id'

    def get_serializer_class(self):
        if self.request.user.is_authenticated and (self.request.user.is_admin or self.get_object().customer == self.request.user):
            return serializers.AdminMeetingSerializer
        return serializers.CustomerMeetingSerializer

    # def get_object(self):
    #     meeting = super(MeetingDetailAPIView, self).get_object()

    #     self.check_object_permissions(self.request, meeting)

    #     return meeting

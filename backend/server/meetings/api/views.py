import datetime

from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework import viewsets, generics, permissions, status
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
        user = request.user

        data = self.get_serializer(queryset, many=True).data

        if user.is_authenticated and not(user.is_admin):
            for i in range(len(data)):
                if data[i]['customer_id'] == user.id:
                    data[i] = serializers.AdminMeetingSerializer(Meeting.objects.get(id=data[i]['id']), many=False).data

        return Response(data)

    def get_queryset(self):
        # Get date start of week
        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())

        from_ = self.request.query_params.get('from', monday)
        to = self.request.query_params.get('to', monday + datetime.timedelta(days=8))
        to = datetime.datetime.strptime(to, '%Y-%m-%d') + datetime.timedelta(days=1)

        return Meeting.objects.filter(start__gte=from_, start__lte=to).select_related('barber', 'customer')


@method_decorator(csrf_protect, name='update')
@method_decorator(csrf_protect, name='destroy')
class MeetingDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsOwnerOrIsAdminOrReadOnly,)
    queryset = Meeting.objects.select_related('barber', 'customer')
    lookup_field = 'id'
    lookup_url_kwarg = 'meeting_id'

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return serializers.AdminMeetingSerializer
        return serializers.CustomerMeetingSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.is_authenticated and (request.user.is_admin or instance.customer_id == request.user.id):
            serializer = serializers.AdminMeetingSerializer(instance)
        else:
            serializer = serializers.CustomerMeetingSerializer(instance)

        return Response(serializer.data)

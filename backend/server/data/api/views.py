from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import fields, permissions

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.permissions import IsAdminOrReadOnly
from data.models import Data, Notification
from . import serializers


@method_decorator(csrf_protect, name='patch')
class DataListAPIView(APIView):
    permission_classes = (IsAdminOrReadOnly,)
    serializer_class = serializers.DataSerializer
    object = Data.objects.first()

    def get(self, request):
        serializer = self.serializer_class(self.object, many=False)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        serializer = self.serializer_class(self.object, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class NotificationsUnreadAmountAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id

        return Response(Notification.objects.filter(recivers__id=user_id, read=False).count())


class NotificationListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.NotificationSerializer

    def get_queryset(self):
        user_id = self.request.user.id

        return Notification.objects.filter(recivers__id=user_id).order_by('-date')[:15]


@method_decorator(csrf_protect, name='dispatch')
class NotificationUpdateAPIView(UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.NotificationUpdateSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'notification_id'

    def get_queryset(self):
        user_id = self.request.user.id

        return Notification.objects.filter(recivers__id=user_id)

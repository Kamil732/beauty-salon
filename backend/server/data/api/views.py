from django.db.models import query
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from server.permissions import IsAdminOrReadOnly, IsAdmin
from data.models import Data, Service, Notification
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


@method_decorator(csrf_protect, name='dispatch')
class ServiceDetailAPIView(UpdateModelMixin, DestroyModelMixin, GenericAPIView):
    permission_classes = (IsAdmin,)
    queryset = Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'service_id'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@method_decorator(csrf_protect, name='dispatch')
class ServiceCreateAPIView(CreateAPIView):
    permission_classes = (IsAdmin,)
    serializer_class = serializers.ServiceSerializer
    queryset = Service.objects.all()


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

        return Notification.objects.filter(recivers__id=user_id).order_by('-date')


@method_decorator(csrf_protect, name='update')
class NotificationDetailAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    lookup_field = 'id'
    lookup_url_kwarg = 'notification_id'

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return serializers.NotificationWriteSerializer
        return serializers.NotificationSerializer

    def get_queryset(self):
        user_id = self.request.user.id

        return Notification.objects.filter(recivers__id=user_id)

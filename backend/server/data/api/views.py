from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework.response import Response

from server.permissions import IsAdmin
from accounts.models import Account
from data.models import Data
from . import serializers


class DataListAPIView(ListAPIView):
    queryset = Data.objects.all()
    serializer_class = serializers.DataSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        data = {}

        for serialized_data in serializer.data:
            data[serialized_data['name']] = serialized_data['value']

        data['one_slot_max_meetings'] = Account.objects.filter(is_admin=True).count()

        return Response(data)


@method_decorator(csrf_protect, name='dispatch')
class UpdateDataAPIView(UpdateAPIView):
    permission_classes = (IsAdmin,)
    serializer_class = serializers.DataSerializer
    queryset = Data.objects.all()
    lookup_field = 'name'
    lookup_url_kwarg = 'data_name'

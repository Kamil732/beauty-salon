from rest_framework.generics import ListAPIView
from rest_framework.response import Response

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

        return Response(data)
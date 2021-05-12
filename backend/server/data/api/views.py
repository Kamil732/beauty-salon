from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from rest_framework.views import APIView
from rest_framework.response import Response

from server.permissions import IsAdminOrReadOnly
from data.models import Data
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

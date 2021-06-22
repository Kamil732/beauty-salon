from django.db.models import Q
from django.db.models import Value as V
from django.db.models.functions import Concat
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, generics, status, mixins
from rest_framework.exceptions import ValidationError

from . import serializers
from . import pagination
from server.permissions import IsAdminOrReadOnly, IsAdmin
from accounts.models import CustomerImage, Customer, Barber


class CurrentAccountAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.AccountSerializer

    def get_object(self):
        return self.request.user


@method_decorator(csrf_protect, name='dispatch')
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = serializers.RegisterSerializer


@method_decorator(csrf_protect, name='dispatch')
class LoginAPIView(APIView):
    def post(self, request, format=None):
        data = request.data

        email = data['email']
        password = data['password']

        user = auth.authenticate(email=email, password=password)

        if user is not None:
            auth.login(request, user)

            return Response({
                'message': 'Pomyślnie zalogowano',
                'user': serializers.AccountSerializer(user).data,
            }, status=status.HTTP_200_OK)
        raise ValidationError({'detail': 'Email lub hasło jest niepoprawne'})


@method_decorator(csrf_protect, name='dispatch')
class UpdateBarberAPIView(generics.UpdateAPIView):
    permission_classes = (IsAdmin,)
    serializer_class = serializers.BarberSerializer
    queryset = Barber.objects.all()
    lookup_field = 'slug'
    lookup_url_kwarg = 'barber_slug'


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        auth.logout(request)

        return Response({'message': 'Pomyślnie wylogowano'})


@method_decorator(csrf_protect, name='create')
class CustomerImageListAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = CustomerImage.objects.order_by('-id')
    serializer_class = serializers.CustomerImageSerializer
    pagination_class = pagination.CustomerImagesPagination

    def create(self, request, *args, **kwargs):
        data = []
        field_ids = []

        for (key, value) in request.data.items():
            field = key.split('-')[0]
            field_id = int(key.split('-')[1])

            if field_id in field_ids:
                data[field_id][field] = value
            else:
                field_ids.append(field_id)
                data.append({
                    field: value,
                })

        serializer = self.get_serializer(data=data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@method_decorator(csrf_protect, name='dispatch')
class CustomerImageDetailAPIView(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    permission_classes = (IsAdmin,)
    queryset = CustomerImage.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'customer_image_id'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class CustomerListAPIView(generics.ListCreateAPIView):
    # permission_classes = (IsAdmin,)
    serializer_class = serializers.CustomerSerializer

    def get_queryset(self):
        search_field = self.request.query_params.get('search', '')

        return Customer.objects.annotate(full_name=Concat('first_name', V(' '), 'last_name')).filter(Q(full_name__istartswith=search_field) | Q(
            first_name__istartswith=search_field) | Q(last_name__istartswith=search_field))[:10]


class BarberListAPIView(generics.ListCreateAPIView):
    # permission_classes = (IsAdminOrReadOnly,)
    serializer_class = serializers.BarberSerializer
    queryset = Barber.objects.prefetch_related('service_barber_data')

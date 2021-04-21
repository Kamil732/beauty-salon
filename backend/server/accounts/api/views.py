from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, generics, status, viewsets, mixins
from rest_framework.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib import auth

from . import serializers
from . import pagination
from server.permissions import IsAdminOrReadOnly, IsAdmin
from accounts.models import CustomerImage, Account


class CurrentAccountAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = serializers.AccountSerializer

    def get_object(self):
        return self.request.user


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})


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
class LogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        auth.logout(request)

        return Response({'message': 'Pomyślnie wylogowano'})


@method_decorator(csrf_protect, name='list')
@method_decorator(csrf_protect, name='create')
@method_decorator(csrf_protect, name='update')
@method_decorator(csrf_protect, name='destroy')
class CustomerImageViewSet(mixins.CreateModelMixin,
                           mixins.ListModelMixin,
                           mixins.UpdateModelMixin,
                           mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    permission_classes = (IsAdminOrReadOnly,)
    queryset = CustomerImage.objects.order_by('-id')
    serializer_class = serializers.CustomerImageSerializer
    pagination_class = pagination.CustomerImagesPagination


class CustomerListAPIView(APIView):
    permission_classes = (IsAdmin,)

    def get(self, request, *args, **kwargs):
        search_field = request.query_params.get('search', '')

        accounts = Account.objects.filter(Q(first_name__istartswith=search_field) | Q(
            last_name__istartswith=search_field)).exclude(is_admin=True)[:10]
        res = [
            {
                'label': account.get_full_name(),
                'value': serializers.AccountSerializer(account).data,
            }
            for account in accounts
        ]

        return Response(res)


class BarberListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        search_field = request.query_params.get('search', '')

        accounts = Account.objects.filter(Q(first_name__istartswith=search_field) | Q(
            last_name__istartswith=search_field)).exclude(is_admin=False).values('slug', 'first_name', 'last_name')

        res = [
            {
                'label': f"{account['first_name']} {account['last_name']}",
                'value': account['slug'],
            }
            for account in accounts
        ]

        return Response(res)

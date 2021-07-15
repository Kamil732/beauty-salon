from django.contrib.auth.models import User
from rest_framework import serializers

from accounts.models import Account, Barber, CustomerImage, Customer
# from data.models import ServiceBarber
from data.api.serializers import ServiceBarberSerializer


class CustomerSerializer(serializers.ModelSerializer):
    # account = AccountSerializer()
    full_name = serializers.ReadOnlyField(source='get_full_name')

    class Meta:
        model = Customer
        # fields = '__all__'
        exclude = ('account',)


class AccountSerializer(serializers.ModelSerializer):
    # Return profile
    profile = CustomerSerializer()

    class Meta:
        model = Account
        exclude = ('password', 'is_superuser', 'is_staff',)


class BarberSerializer(serializers.ModelSerializer):
    services_data = ServiceBarberSerializer(source='service_barber_data', many=True)
    full_name = serializers.ReadOnlyField(source='get_full_name')

    class Meta:
        model = Barber
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if not(data['password'] == data['password2']):
            raise serializers.ValidationError(
                {'password': 'passwords are not the same'})

        return data

    class Meta:
        model = User
        fields = (
            'email',
            'password',
            'password2',
        )

    def create(self, data):
        email = data['email']
        password = data['password']

        return Account.objects.create_user(email=email, password=password)


class CustomerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerImage
        fields = ('image', 'title', 'id',)

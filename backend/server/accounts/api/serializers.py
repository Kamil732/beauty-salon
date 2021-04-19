from rest_framework import serializers
from django.contrib.auth.models import User

from accounts.models import Account, CustomerImage


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'email', 'phone_number', 'fax_number', 'first_name', 'last_name', 'slug', 'is_admin',)


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

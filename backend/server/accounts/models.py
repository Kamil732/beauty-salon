from django.db import models
from django.db.models.fields.related import OneToOneField
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from server.abstract.models import Color
from autoslug import AutoSlugField


class AccountManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, phone_number, password=None):
        if not email:
            raise ValueError('Users must have an email')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')
        if not phone_number:
            raise ValueError('Users must have a phone number')

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, first_name, last_name, phone_number, password):
        user = self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            password=password,
        )
        user.is_active = True
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        Barber.objects.create(first_name=user.first_name, last_name=user.last_name)

        return user


class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name='E-mail adres', max_length=80, unique=True)
    is_active = models.BooleanField(verbose_name='Jest aktywowany?', default=True)
    is_admin = models.BooleanField(verbose_name='Jest adminem?', default=False)
    is_staff = models.BooleanField(verbose_name='Ma uprawnienia?', default=False)
    is_superuser = models.BooleanField(verbose_name='Jest super urzytkownikiem?', default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = AccountManager()

    def __str__(self):
        if self.profile:
            return self.profile
        return self.email

    @property
    def room_name(self):
        return f'user_{self.id}'

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class Customer(models.Model):
    account = models.OneToOneField(Account, on_delete=models.SET_NULL, blank=True, null=True, related_name='profile')
    first_name = models.CharField(verbose_name='Imię', max_length=20)
    last_name = models.CharField(verbose_name='Nazwisko', max_length=20)
    phone_number = PhoneNumberField(verbose_name='Numer telefonu')
    fax_number = PhoneNumberField(verbose_name='Zapasowy Numer telefonu', blank=True)
    bookings = models.PositiveIntegerField(default=0)
    no_shows = models.PositiveIntegerField(default=0)
    revenue = models.PositiveIntegerField(default=0)
    trusted = models.BooleanField(default=False)
    slug = AutoSlugField(populate_from='first_name', unique=True)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'


class Barber(Color):

    first_name = models.CharField(verbose_name='Imię', max_length=20)
    last_name = models.CharField(verbose_name='Nazwisko', max_length=20)
    slug = AutoSlugField(populate_from='first_name', unique=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'


class CustomerImage(models.Model):
    image = models.ImageField(upload_to='customer_images/%Y/%m/%d/')
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title

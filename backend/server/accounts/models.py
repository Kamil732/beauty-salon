from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

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
        return user


class Account(AbstractBaseUser):
    email = models.EmailField(verbose_name='E-mail adres', max_length=80, unique=True)
    first_name = models.CharField(verbose_name='Imię', max_length=20)
    last_name = models.CharField(verbose_name='Nazwisko', max_length=20)
    phone_number = PhoneNumberField(verbose_name='Numer telefonu')
    fax_number = PhoneNumberField(verbose_name='Zapasowy Numer telefonu', blank=True)
    trusted_customer = models.BooleanField(default=False)

    is_active = models.BooleanField(verbose_name='Jest aktywowany?', default=True)
    is_admin = models.BooleanField(verbose_name='Jest adminem?', default=False)
    is_staff = models.BooleanField(verbose_name='Ma uprawnienia?', default=False)
    is_superuser = models.BooleanField(verbose_name='Jest super urzytkownikiem?', default=False)
    slug = AutoSlugField(populate_from='first_name')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number']
    objects = AccountManager()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class CustomerImage(models.Model):
    image = models.ImageField(upload_to='customer_images/%Y/%m/%d/')
    title = models.CharField(max_length=100)

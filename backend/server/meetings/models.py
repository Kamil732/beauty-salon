from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

from datetime import timedelta
from phonenumber_field.modelfields import PhoneNumberField

from accounts.models import Account


class Meeting(models.Model):
    TYPES = (
        ('hair', 'Włosy'),
        ('beard', 'Broda'),
        ('do_not_work', 'NIE PRACUJE'),
    )

    barber = models.ForeignKey(verbose_name='Fryzjer', to=Account, on_delete=models.CASCADE, blank=True, null=True)
    customer = models.ForeignKey(verbose_name='Konto klienta', to=Account, blank=True,
                                 null=True, on_delete=models.DO_NOTHING, related_name='meetings')
    customer_first_name = models.CharField(verbose_name='Imię klienta', max_length=20)
    customer_last_name = models.CharField(verbose_name='Nazwisko klienta', max_length=20)
    customer_phone_number = PhoneNumberField(verbose_name='Numer telefonu klienta')
    customer_fax_number = PhoneNumberField(verbose_name='Zapasowy numer telefonu klienta', blank=True)
    type = models.CharField(verbose_name='Typ wizyty', max_length=11, choices=TYPES)
    start = models.DateTimeField(verbose_name='Zaczyna się o')
    end = models.DateTimeField(verbose_name='Kończy się o', blank=True)

    def __str__(self):
        return self.type

    def clean(self):
        if not(self.type == self.TYPES[2][0]):
            if not(self.barber) or not(self.barber.is_admin):
                raise ValidationError('Wybrany fryzjer nie jest fryzjerem')

        if self.end and self.end <= self.start:
            raise ValidationError('Niepoprawna data wizyty')

    def save(self, *args, **kwargs):
        if not(self.end):
            self.end = self.start + timedelta(minutes=30)

        return super(Meeting, self).save(*args, **kwargs)

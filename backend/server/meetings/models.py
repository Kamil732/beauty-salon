from django.db import models
from django.core.exceptions import ValidationError

from datetime import timedelta
from phonenumber_field.modelfields import PhoneNumberField

from accounts.models import Account, Barber


class Meeting(models.Model):
    barber = models.ForeignKey(verbose_name='Fryzjer', to=Barber, on_delete=models.CASCADE, blank=True, null=True)
    customer = models.ForeignKey(verbose_name='Konto klienta', to=Account, blank=True,
                                 null=True, on_delete=models.DO_NOTHING, related_name='meetings')
    customer_first_name = models.CharField(verbose_name='Imię klienta', blank=True, max_length=20)
    customer_last_name = models.CharField(verbose_name='Nazwisko klienta', blank=True, max_length=20)
    customer_phone_number = PhoneNumberField(verbose_name='Numer telefonu klienta', blank=True)
    customer_fax_number = PhoneNumberField(verbose_name='Zapasowy numer telefonu klienta', blank=True)
    service = models.ForeignKey('data.Service', on_delete=models.CASCADE,
                                blank=True, null=True, related_name='meetings')
    start = models.DateTimeField(verbose_name='Zaczyna się o')
    end = models.DateTimeField(verbose_name='Kończy się o', blank=True)
    confirmed = models.BooleanField(default=False)
    do_not_work = models.BooleanField(default=False)

    def __str__(self):
        return self.service.name

    def clean(self):
        if not(self.do_not_work) and not(self.barber):
            raise ValidationError('Musisz wybrać fryzjera')

        if self.end and self.end <= self.start:
            raise ValidationError('Niepoprawna data wizyty')

    def save(self, *args, **kwargs):
        if not(self.end):
            self.end = self.start + timedelta(minutes=30)

        return super(Meeting, self).save(*args, **kwargs)

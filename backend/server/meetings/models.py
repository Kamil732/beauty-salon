from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta

from accounts.models import Account

class Meeting(models.Model):
    TYPES = (
        ('hair', 'Włosy'),
        ('beard', 'Broda'),
        ('do_not_work', 'NIE PRACUJE'),
    )

    barber = models.ForeignKey(verbose_name='Fryzjer', to=Account, blank=True, null=True, on_delete=models.CASCADE)
    customer = models.ForeignKey(verbose_name='Konto Klienta', to=Account, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='meetings')
    customer_first_name = models.CharField(verbose_name='Imię Klienta', max_length=20, blank=True)
    type = models.CharField(verbose_name='Typ Wizyty', max_length=11, choices=TYPES)
    start = models.DateTimeField(verbose_name='Zaczyna się o')
    end = models.DateTimeField(verbose_name='Kończy się o', blank=True)

    def __str__(self):
        return self.type

    def clean(self):
        if not(self.type == self.TYPES[2][0]):
            if not(self.customer) and not(self.customer_first_name):
                raise ValidationError('Klient musi mieć imię')

            if not(self.barber) or not(self.barber.is_admin):
                raise ValidationError('Wybrany fryzjer nie jest fryzjerem')

        if self.end and self.end <= self.start:
            raise ValidationError('Niepoprawna data wizyty')

    def save(self, *args, **kwargs):
        if self.customer:
            self.customer_first_name = self.customer.first_name

        if not(self.end):
            self.end = self.start + timedelta(minutes=30)

        return super(Meeting, self).save(*args, **kwargs)
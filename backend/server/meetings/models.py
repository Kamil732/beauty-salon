from django.db import models
from django.core.exceptions import ValidationError

from datetime import timedelta

from accounts.models import Customer, Barber


class Meeting(models.Model):
    barber = models.ForeignKey(verbose_name='Fryzjer', to=Barber, on_delete=models.CASCADE,
                               blank=True, null=True, related_name='meetings')
    customer = models.ForeignKey(verbose_name='Klient', to=Customer, on_delete=models.CASCADE,
                                 blank=True, null=True, related_name='meetings')
    services = models.ManyToManyField('data.Service', blank=True, through='ServiceData', related_name='meetings')
    resources = models.ManyToManyField('data.Resource', blank=True, related_name='meetings')
    start = models.DateTimeField(verbose_name='Zaczyna się o')
    end = models.DateTimeField(verbose_name='Kończy się o')
    description = models.TextField(blank=True)
    confirmed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.barber} - {self.customer}'

    def clean(self):
        if self.end and self.end <= self.start:
            raise ValidationError('Niepoprawna data wizyty')

    def save(self, *args, **kwargs):
        if not(self.end):
            self.end = self.start + timedelta(minutes=30)

        return super(Meeting, self).save(*args, **kwargs)


class ServiceData(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='services_data')
    service = models.ForeignKey('data.Service', on_delete=models.CASCADE, related_name='services_data')
    barber = models.ForeignKey(Barber, on_delete=models.CASCADE, related_name='services_data')
    resources = models.ManyToManyField('data.Resource', blank=True, related_name='services_data')

    def __str__(self):
        return f'{self.meeting} - {self.service}'

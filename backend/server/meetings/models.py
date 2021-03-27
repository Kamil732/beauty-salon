from django.db import models

from accounts.models import Account

class Meeting(models.Model):
    TYPES = (
        ('hair', 'Włosy'),
        ('beard', 'Broda'),
    )

    account = models.ForeignKey(verbose_name='Konto Klienta', to=Account, blank=True, null=True, on_delete=models.DO_NOTHING, related_name='meetings')
    type = models.CharField(verbose_name='Typ Wizyty', max_length=5, choices=TYPES)
    start = models.DateTimeField(verbose_name='Wizyta jest o')

    def __str__(self):
        return self.type
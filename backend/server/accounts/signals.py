from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from data.models import Data
from accounts.models import Barber


@receiver(post_save, sender=Barber)
def add_1_one_slot_meetings(sender, instance, created, **kwargs):
    if (created):
        cms_data = Data.objects.first()
        cms_data.one_slot_max_meetings += 1
        cms_data.save()


@receiver(post_delete, sender=Barber)
def remove_1_one_slot_meetings(**kwargs):
    cms_data = Data.objects.first()
    cms_data.one_slot_max_meetings -= 1
    cms_data.save()

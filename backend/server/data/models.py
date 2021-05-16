from datetime import timedelta

from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from accounts.models import Account


class Data(models.Model):
    meeting_bail = models.DecimalField(decimal_places=2, default=10, max_digits=4)
    meeting_prepayment = models.DecimalField(decimal_places=2, default=15, max_digits=4)
    free_cancel_hours = models.PositiveIntegerField(default=2)
    hair_price = models.DecimalField(decimal_places=2, max_digits=4, default=25)
    beard_price = models.DecimalField(decimal_places=2, max_digits=4, default=25)
    message = models.CharField(max_length=100, blank=True)
    contact_content_second = models.TextField(blank=True)
    gallery_content = models.TextField(blank=True)
    gallery_title = models.CharField(max_length=100, blank=True)
    contact_content = models.TextField(blank=True)
    contact_title = models.CharField(max_length=100, blank=True)
    home_content = models.TextField(blank=True)
    home_title = models.CharField(max_length=100, blank=True)
    one_slot_max_meetings = models.PositiveIntegerField(default=0, editable=False)
    work_time = models.PositiveIntegerField(default=30)
    end_work_sunday = models.TimeField(null=True, blank=True)
    start_work_sunday = models.TimeField(null=True, blank=True)
    end_work_saturday = models.TimeField(null=True, blank=True)
    start_work_saturday = models.TimeField(null=True, blank=True)
    end_work_friday = models.TimeField(null=True, blank=True)
    start_work_friday = models.TimeField(null=True, blank=True)
    end_work_thursday = models.TimeField(null=True, blank=True)
    start_work_thursday = models.TimeField(null=True, blank=True)
    end_work_wednesday = models.TimeField(null=True, blank=True)
    start_work_wednesday = models.TimeField(null=True, blank=True)
    end_work_tuesday = models.TimeField(null=True, blank=True)
    start_work_tuesday = models.TimeField(null=True, blank=True)
    end_work_monday = models.TimeField(null=True, blank=True)
    start_work_monday = models.TimeField(null=True, blank=True)
    google_maps_url = models.URLField(blank=True, max_length=500)
    location = models.CharField(max_length=100, blank=True)
    phone_number = PhoneNumberField(blank=True)

    def save(self, *args, **kwargs):
        # this will check if the variable exist so we can update the existing ones
        save_permission = Data.has_add_permission(self)

        # if there's more than two objects it will not save them in the database
        if Data.objects.all().count() < 2 or save_permission:
            self.one_slot_max_meetings = Account.objects.filter(is_admin=True).count()

            return super(Data, self).save(*args, **kwargs)

    def has_add_permission(self):
        return Data.objects.filter(id=self.id).exists()


class Notification(models.Model):
    recivers = models.ManyToManyField(Account, related_name='notifications')
    date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=80)
    message = models.TextField()
    read = models.BooleanField(default=False)

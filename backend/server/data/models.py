from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from accounts.models import Account
from meetings.models import Meeting


class Data(models.Model):
    meeting_bail = models.DecimalField(decimal_places=2, default=10, max_digits=4)
    meeting_prepayment = models.DecimalField(decimal_places=2, default=15, max_digits=4)
    free_cancel_hours = models.PositiveIntegerField(default=2)
    message = models.CharField(max_length=100, blank=True)
    contact_content_second = models.TextField(blank=True)
    gallery_content = models.TextField(blank=True)
    gallery_title = models.CharField(max_length=100, blank=True)
    contact_content = models.TextField(blank=True)
    contact_title = models.CharField(max_length=100, blank=True)
    home_content = models.TextField(blank=True)
    home_title = models.CharField(max_length=100, blank=True)
    one_slot_max_meetings = models.PositiveIntegerField(default=0)
    # work_time = models.PositiveIntegerField(default=30)
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
            return super(Data, self).save(*args, **kwargs)

    def has_add_permission(self):
        return Data.objects.filter(id=self.id).exists()


class ServiceGroup(models.Model):
    name = models.CharField(max_length=30, unique=True)
    barbers = models.ManyToManyField('accounts.Barber', related_name='service_groups')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='children')

    def __str__(self):
        full_path = [self.name]
        k = self.parent

        while k is not None:
            full_path.append(k.name)
            k = k.parent

        return ' -> '.join(full_path[::-1])


class Service(models.Model):
    VAT = (
        (23, '23%'),
        (8, '8%'),
        (5, '5%'),
        (0, '0%'),
    )

    group = models.ForeignKey(ServiceGroup, on_delete=models.CASCADE, blank=True, null=True, related_name='services')
    barbers = models.ManyToManyField('accounts.Barber', through='ServiceBarber', related_name='services')
    name = models.CharField(max_length=25)
    time = models.PositiveIntegerField(default=0)
    price = models.DecimalField(decimal_places=2, max_digits=5)
    vat = models.PositiveSmallIntegerField(default=0, choices=VAT)
    choosen_times = models.PositiveIntegerField(default=0)
    private_description = models.TextField(blank=True)
    public_description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.name} - {self.price} zł'


class ServiceImage(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='service_images/%Y/%m/%d/')


class ServiceBarber(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='service_barber_data')
    barber = models.ForeignKey('accounts.Barber', on_delete=models.CASCADE, related_name='service_barber_data')
    time = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f'{self.barber} - {self.service}'


class Notification(models.Model):
    recivers = models.ManyToManyField(Account, related_name='notifications')
    date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=80)
    message = models.TextField()
    read = models.BooleanField(default=False)
    meeting = models.ForeignKey(Meeting, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        title = self.title[:5]
        if len(self.title) > 5:
            title += '...'

        return title

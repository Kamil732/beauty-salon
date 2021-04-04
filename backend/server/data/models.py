from django.db import models

class Data(models.Model):
    display_name = models.CharField(max_length=50)
    name = models.CharField(max_length=30)
    value = models.CharField(max_length=400, blank=True)
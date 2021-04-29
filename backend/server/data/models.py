from django.db import models


class Data(models.Model):
    name = models.CharField(max_length=30, unique=True)
    value = models.CharField(max_length=400, blank=True)

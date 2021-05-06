from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Data


@admin.register(Data)
class DataAdmin(ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

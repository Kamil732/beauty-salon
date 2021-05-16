from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Data, Notification


@admin.register(Data)
class DataAdmin(ModelAdmin):
    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = ('title', 'date', 'read',)
    readonly_fields = ('date',)

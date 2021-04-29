from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Data


@admin.register(Data)
class DataAdmin(ModelAdmin):
    list_display = ('name', 'value',)
    list_editable = ('value',)
    search_fields = ('name',)
    readonly_fields = ('name',)
    fields = ('name', 'value',)

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

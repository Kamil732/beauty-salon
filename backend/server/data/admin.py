from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Data

@admin.register(Data)
class DataAdmin(ModelAdmin):
    list_display = ('display_name', 'value',)
    list_editable = ('value',)
    search_fields = ('display_name',)
    readonly_fields = ('display_name',)
    fields = ('display_name', 'value',)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request):
        return False
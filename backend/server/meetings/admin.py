from django.contrib import admin
from django.contrib.admin import ModelAdmin

from accounts.models import Account
from .models import Meeting

@admin.register(Meeting)
class MeetingAdmin(ModelAdmin):
    empty_value_display = '-?-'
    list_display = ('type', 'customer_first_name', 'start', 'end',)
    search_fields = ('type', 'customer_first_name', 'start', 'end',)
    list_editable = ('start', 'end',)
    readonly_fields = ('id',)
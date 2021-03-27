from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Account

@admin.register(Account)
class AccountAdmin(ModelAdmin):
    empty_value_display = '--empty--'
    list_display = ('first_name', 'last_name', 'phone_number',)
    search_fields = ('first_name', 'last_name', 'phone_number', 'fax_number')
    readonly_fields = ('id',)
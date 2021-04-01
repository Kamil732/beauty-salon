from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Account, CustomerImage

@admin.register(Account)
class AccountAdmin(ModelAdmin):
    empty_value_display = '--empty--'
    list_display = ('first_name', 'last_name', 'phone_number',)
    search_fields = ('first_name', 'last_name', 'phone_number', 'fax_number')
    readonly_fields = ('id',)

@admin.register(CustomerImage)
class CustomerImageAdmin(ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)
    readonly_fields = ('id',)
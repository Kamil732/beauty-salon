from django.contrib import admin
from django.contrib.admin import ModelAdmin

from accounts.models import Account
from .models import Meeting

@admin.register(Meeting)
class MeetingAdmin(ModelAdmin):
    empty_value_display = '-?-'
    list_display = ('type', 'customer_first_name', 'start',)
    search_fields = ('type', 'account__first_name', 'start',)
    list_editable = ('start',)
    readonly_fields = ('id',)

    def customer_first_name(self, obj):
        if obj.account:
            return obj.account.first_name

    customer_first_name.short_description = 'Imię klienta'
from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Meeting


@admin.register(Meeting)
class MeetingAdmin(ModelAdmin):
    empty_value_display = '-?-'
    list_display = ('service', 'customer_first_name', 'barber', 'start', 'end',)
    search_fields = ('service', 'customer_first_name', 'start', 'end',)
    list_editable = ('start', 'end',)
    readonly_fields = ('id',)


admin.site.site_header = 'Panel Administracyjny'

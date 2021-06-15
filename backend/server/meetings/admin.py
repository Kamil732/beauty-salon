from django.contrib import admin
from django.contrib.admin import ModelAdmin

from .models import Meeting


@admin.register(Meeting)
class MeetingAdmin(ModelAdmin):
    empty_value_display = '-?-'
    list_display = ('barber', 'start', 'end',)
    readonly_fields = ('id',)


admin.site.site_header = 'Panel Administracyjny'

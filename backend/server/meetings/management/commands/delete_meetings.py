from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from meetings.models import Meeting

class Command(BaseCommand):

    help = 'Usuwa wizyty, które są przestarzałe'

    def handle(self, *args, **options):
        Meeting.objects.filter(start__lt=timezone.now() - timedelta(minutes=30)).delete()
        print('\nWszystkie przestarzale wizyty zostaly usuniete\n')
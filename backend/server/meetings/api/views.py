from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
import datetime

from rest_framework import viewsets, generics
import rest_framework.mixins as api_mixins

from meetings.models import Meeting
from . import mixins

# TODO: Delete old meetings after GET method


@method_decorator(csrf_protect, name='create')
class MeetingListAPIView(mixins.MeetingMixin, generics.ListCreateAPIView):
    def get_queryset(self):
        # Get date start of week
        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())

        from_ = self.request.query_params.get('from', monday)
        to = self.request.query_params.get('to', monday + datetime.timedelta(days=7))

        return Meeting.objects.filter(start__gte=from_, start__lte=to)


@method_decorator(csrf_protect, name='dispatch')
class MeetingDetailAPIView(mixins.MeetingMixin, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'meeting_id'

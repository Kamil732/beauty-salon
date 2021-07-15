from django.urls import path

from meetings.consumers import MeetingConsumer
from data.consumers import NotificationConsumer

websocket_urlpatterns = [
    path(r'meetings/', MeetingConsumer.as_asgi()),
    path(r'notifications/', NotificationConsumer.as_asgi()),
]

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(r'meetings/', consumers.MeetingConsumer.as_asgi()),
]
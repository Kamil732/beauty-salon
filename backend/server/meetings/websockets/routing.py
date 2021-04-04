from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path(r'ws/meetings/', consumers.MeetingConsumer.as_asgi()),
]
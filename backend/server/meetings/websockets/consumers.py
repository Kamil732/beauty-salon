import datetime
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from meetings.api.serializers import MeetingSerializer
from meetings.models import Meeting

class MeetingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'meeting'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get('event', None)
        meetings = response.get('meetings', [])

        if event == 'CREATE_MEETING':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'create_meeting',
                    'message': message,
                }
            )

    async def create_meeting(self, event):

        # Send message to WebSocket
        await self.send_json({
            'meetings': event['meetings'],
        })
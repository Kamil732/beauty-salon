import datetime
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from meetings.api.serializers import MeetingSerializer
from meetings.models import Meeting

class MeetingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'meetings'

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
        type = response.get('type')
        payload = response.get('payload')

        if type == 'DELETE_MEETING':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'delete_meeting',
                    'payload': payload,
                }
            )

    async def delete_meeting(self, event):

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'DELETE_MEETING',
            'payload': event['payload'],
        }))
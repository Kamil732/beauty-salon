import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Meeting


class MeetingConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'meetings'
        self.user = self.scope['user']

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

    @database_sync_to_async
    def check_is_owner(self, id):
        try:
            return Meeting.objects.get(id=id).customer == self.user
        except:
            return False

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get('event')
        payload = response.get('payload')

        # Check permissions
        if self.user.is_authenticated:
            if not(self.user.is_admin) and (event == 'REMOVE_MEETING' or event == 'UPDATE_MEETING') and not(self.check_is_owner(payload)):
                return

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_data',
                    'event': event,
                    'payload': payload,
                }
            )

    async def send_data(self, event):
        await self.send(text_data=json.dumps({
            'event': event['event'],
            'payload': event['payload'],
        }))

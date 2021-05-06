import datetime
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from meetings.models import Meeting
from meetings.api.serializers import AdminMeetingSerializer

from accounts.models import Account


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
    def check_is_owner(id):
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
            if not(self.user.is_admin):
                if event == 'REMOVE_MEETING' and not(self.check_is_owner(payload)):
                    return
                if event == 'UPDATE_MEETING' and not(self.check_is_owner(payload['id'])):
                    return
                elif event == 'UPDATE_DATA':
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

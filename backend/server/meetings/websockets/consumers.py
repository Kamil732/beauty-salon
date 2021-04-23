import datetime
import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from meetings.models import Meeting
from meetings.api.serializers import AdminMeetingSerializer

from accounts.models import Account

#### Send to all chats ####
# this.props.ws.send(
#     JSON.stringify({
#         event: REMOVE_MEETING,
#         payload: selected.id,
#     })
# )


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
        return Meeting.objects.get(id=id).customer == self.user

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get('event')
        payload = response.get('payload')

        # Only admin can delete or add meeting
        if self.user.is_authenticated and (event == 'REMOVE_MEETING' or event == 'ADD_MEETING' or event == 'UPDATE_DATA'):
            if event == 'REMOVE_MEETING' and not(self.check_is_owner(payload)):
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

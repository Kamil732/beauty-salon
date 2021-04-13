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

    @database_sync_to_async
    def delete_meeting(self, id):
        Meeting.objects.get(id=id).delete()

    @database_sync_to_async
    def create_meeting(self, payload):
        do_not_work = payload.get('do_not_work')
        start = payload['start']
        end = payload['end']
        customer = Account.objects.get(slug=payload['customer']) if payload['customer'] else None
        customer_first_name = payload['customer_first_name']
        type = payload['type'] if not(do_not_work) else Meeting.TYPES[2][0]

        meeting = Meeting.objects.create(
            start=start,
            end=end,
            customer=customer,
            customer_first_name=customer_first_name,
            type=type
        )

        return AdminMeetingSerializer(meeting).data

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get('event')
        payload = response.get('payload')

        if event == 'DELETE_MEETING':
            await self.delete_meeting(payload)
        elif event == 'ADD_MEETING':
            payload = await self.create_meeting(payload)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_meeting',
                'event': event,
                'payload': payload,
            }
        )

    async def send_meeting(self, event):
        await self.send(text_data=json.dumps({
            'event': event['event'],
            'payload': event['payload'],
        }))
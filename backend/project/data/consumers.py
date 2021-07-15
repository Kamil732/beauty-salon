import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from .models import Notification


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = f'user_{self.user.id}'

        if not(self.user.is_authenticated):
            await self.close()
            return

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

    # @database_sync_to_async
    # async def check_is_owner(self, id):
    #     return Notification.objects.get(id=id).recivers.filter(id=self.user.id).exists()

    # @database_sync_to_async
    # async def get_notification_recivers(self, id):
    #     try:
    #         return Notification.objects.get(id=id).recivers.all()
    #     except:
    #         return []

    async def receive(self, text_data):
        response = json.loads(text_data)
        event = response.get('event')
        payload = response.get('payload')

        # Check permissions
        # and self.check_is_owner(payload)
        # recivers = self.get_notification_recivers(id)

        # if self.user in recivers:
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_data',
                'event': event,
                'payload': payload,
            }
        )

    async def send_data(self, event):
        await self.send_json({
            'event': event['event'],
            'payload': event['payload'],
        })

import os

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    # "websocket": AuthMiddlewareStack(
    #     URLRouter(
    #         chat.routing.websocket_urlpatterns
    #     )
    # ),
})
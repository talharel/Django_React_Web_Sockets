# """
# ASGI config for backend project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
# """

# import os
# from .routing import websocket_urlpatterns
# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ),
# })

# application = get_asgi_application()






import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path,re_path
from codeblocks.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': URLRouter([
        re_path(r'ws/chat/(?P<id>[0-9]+)',ChatConsumer.as_asgi())
        re_path(r'ws/chat/1',ChatConsumer.as_asgi()),
        re_path('ws/chat/1',ChatConsumer.as_asgi()),
        re_path('ws/',ChatConsumer.as_asgi()),
    ]),
})



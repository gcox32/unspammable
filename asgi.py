import os
import django
from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, get_default_application

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unspammable.settings')

application = get_asgi_application()


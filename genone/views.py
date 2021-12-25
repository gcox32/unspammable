from django.db import reset_queries
from django.http.response import HttpResponse
from django.shortcuts import render
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
import os
from django.conf import settings
from django.http import FileResponse

def index(request):
    context = get_platforms_credentials(request)
    print(settings.BASE_DIR)
    return auth_check(request, 'gameboy.html', context=context)

def cartridge(request, title):
    if request.user.is_superuser:
        bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/{title}'), 'rb') 
        response = FileResponse(bytes)
    else:
        response = HttpResponse('nice try.')
    return response

def load_saved_game(request, savefile):
    if request.user.is_superuser:
        bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/savestates/{savefile}'), 'rb') 
        response = FileResponse(bytes)
    else:
        response = HttpResponse('nice try.')
    return response
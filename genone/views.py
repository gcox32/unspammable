from django.db import reset_queries
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from unspammable.settings import SAVESTATES_URL
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
import os
from django.conf import settings
from django.http import FileResponse
from .src.storage import SaveStateStorage
from django.views.decorators.csrf import csrf_exempt

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

@csrf_exempt
def load_saved_game(request, savefile):
    if request.user.is_superuser:
        if request.method == 'POST':
            upload = request.FILES['upload']
            fss = SaveStateStorage(
                location=settings.SAVESTATES_LOC, 
                base_url=settings.SAVESTATES_URL
                )
            try:
                file = fss.save(upload.name, upload)
                print(file)
                fileurl = fss.url(file)
                response = JsonResponse({
                    'response': 'successful upload',
                    'fileurl': fileurl,
                    'status': 200,
                    })
            except:
                response = JsonResponse({
                    'response': 'unsuccessful upload',
                    'status': 200,
                })
        else:
            bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/savestates/{savefile}'), 'rb') 
            response = FileResponse(bytes)
    else:
        response = HttpResponse('nice try.')

    return response
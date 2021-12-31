from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
import os
from django.conf import settings
from django.http import FileResponse
from .src.storage import SaveStateStorage
from django.views.decorators.csrf import csrf_exempt
from .models import Game

def index(request):
    context = get_platforms_credentials(request)
    all_games = Game.objects.all()
    context['games'] = all_games
    savedir = os.path.join(settings.BASE_DIR, 'genone/roms/savestates')
    
    for game, con in zip(all_games, context['games']):
        vers = game.version
        id = str(request.user.id)
        filename = id + "_" + vers + ".json"
        if filename in os.listdir(savedir):
            result = vers + "-savestate" # user-specific save state assigned to cartridge
            con.__setattr__('fileLoc', filename)
        else:
            result = vers + "-new" # blank game assigned to cartridge
        con.__setattr__('stateValue', result)

    return auth_check(request, 'gameboy.html', context=context)

def cartridge(request, title):
    if request.user.is_superuser:
        bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/{title}'), 'rb') 
        response = FileResponse(bytes)
    else:
        response = HttpResponse('nice try, guy.')
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
            uploadName = upload.name
            try:
                if fss.exists(uploadName):
                    print(f'Found existings file with name: {uploadName}')
                    fss.delete(uploadName)
                    print('Deleted old version.')

                file = fss.save(uploadName, upload)
                print(f'Saved state: {uploadName}')
                fileurl = fss.url(file)
                response = JsonResponse({
                    'response': 'successful upload',
                    'fileurl': fileurl,
                    'status': 200,
                    })
            except:
                print('failed')
                response = JsonResponse({
                    'response': 'unsuccessful upload',
                    'status': 200,
                })
        else:
            bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/savestates/{savefile}'), 'rb') 
            response = FileResponse(bytes)
    else:
        response = HttpResponse('nice try, guy.')

    return response

def guess(request):
    context = get_platforms_credentials(request)
    return auth_check(request, 'guess.html', context=context)
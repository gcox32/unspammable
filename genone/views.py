from django.http.response import HttpResponse, JsonResponse
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
import os
from django.conf import settings
from django.http import FileResponse
from .src.storage import handle_uploaded_file
from django.views.decorators.csrf import csrf_exempt
from .models import Game, SaveState
from django.shortcuts import render

def home(request):
    context = get_platforms_credentials(request)
    return render(request,'genonehome.html',context)

def gameboy(request):
    context = get_platforms_credentials(request)
    all_games = Game.objects.all()
    context['games'] = all_games
    context['range'] = range(6)
    
    for game, con in zip(all_games, context['games']):
        vers = game.version
        id = str(request.user.id)
        filename = id + "_" + vers
        game = Game.objects.filter(version=vers)[0]

        if request.user.is_authenticated:
            if len(SaveState.objects.filter(user=request.user, game=game)) > 0:
                result = vers + "-savestate" # user-specific save state assigned to cartridge
                con.__setattr__('fileLoc', filename)
            else:
                result = vers + "-new" # blank game assigned to cartridge
                con.__setattr__('stateValue', result)
        else:
            result = vers + "-new" # blank game assigned to cartridge
            con.__setattr__('stateValue', result)

    return render(request, 'gameboy.html', context)

@csrf_exempt
def cartridge(request, title):
    try:
        gameName = title.split('_')[1] # from "1_blue"
        gameName = gameName.split('.')[0]
        new = False
    except:
        gameName = title.split('.')[0] # from "new-red.gb"
        gameName = gameName.split('-')[1]
        title = title.split('-')[1]
        new = True

    # check for previous save states
    game = Game.objects.filter(version=gameName)[0]
    if request.user.is_authenticated:
        if len(SaveState.objects.filter(user=request.user, game=game)) > 0:
            prev = True
        else:
            prev = False
    else:
        prev = False
    
    tempfile = 'genone/roms/savestates/state.json'
    if request.method == 'POST' and request.user.is_authenticated:
        # request is a POST request
        upload = request.FILES['upload']
        game = Game.objects.get(version=gameName)

        try:
            contents = handle_uploaded_file(upload, tempfile)

            # check for existing savestate
            if prev:
                saveState = SaveState.objects.filter(user=request.user, game=game)[0]
                saveState.data = contents
            else:
                saveState = SaveState(user=request.user, game=game, data=contents)
            saveState.save(
            )

            response = HttpResponse({
                'response': 'successful upload',
                'status': 200,
                })

        except Exception as e:
            print(e)
            response = JsonResponse({
                'response': 'unsuccessful upload',
                'status': 200,
            })
    else:
        # request is a GET request
        try:
            if request.user.is_authenticated and prev and not new:
                # send save state that matches user and game
                saveState = SaveState.objects.filter(user=request.user, game=game)[0]
                chars = saveState.data
                with open(tempfile, 'w') as f:
                    f.write(chars)
                bytes = open(os.path.join(settings.BASE_DIR, tempfile),'rb')
                response = FileResponse(bytes)
            else:
                # send blank new game
                bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/{title}'), 'rb') 
                response = FileResponse(bytes)
                print(response)
        except Exception as e:
            print(e)
            response = JsonResponse({
                'response': 'unsuccessful download',
                'status': 200,
            })

    return response

def wtp(request):
    return auth_check(request, 'wtp.html', context={})
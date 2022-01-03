from django.http.response import HttpResponse, JsonResponse
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
import os, json
from django.conf import settings
from django.http import FileResponse
from .src.storage import SaveStateStorage, handle_uploaded_file
from django.views.decorators.csrf import csrf_exempt
from .models import Game, SaveState

def home(request):
    context = get_platforms_credentials(request)
    return auth_check(request,'genonehome.html',context=context)

def gameboy(request):
    context = get_platforms_credentials(request)
    all_games = Game.objects.all()
    context['games'] = all_games
    savedir = os.path.join(settings.BASE_DIR, 'genone/roms/savestates')
    
    for game, con in zip(all_games, context['games']):
        vers = game.version
        id = str(request.user.id)
        filename = id + "_" + vers
        game = Game.objects.filter(version=vers)[0]
        if len(SaveState.objects.filter(user=request.user, game=game)) > 0:
            result = vers + "-savestate" # user-specific save state assigned to cartridge
            con.__setattr__('fileLoc', filename)
        else:
            result = vers + "-new" # blank game assigned to cartridge
        con.__setattr__('stateValue', result)

    return auth_check(request, 'gameboy.html', context=context)

@csrf_exempt
def cartridge(request, title):
    if request.user.is_superuser:
        try:
            gameName = title.split('_')[1] # from "1_blue"
            gameName = gameName.split('.')[0]
            new = False
        except:
            print('title: ', title)
            gameName = title.split('.')[0] # from "new-red.gb"
            gameName = gameName.split('-')[1]
            title = title.split('-')[1]
            print('title: ', title)
            new = True

        # check for previous save states
        game = Game.objects.filter(version=gameName)[0]
        if len(SaveState.objects.filter(user=request.user, game=game)) > 0:
            prev = True
        else:
            prev = False
        
        tempfile = 'genone/roms/savestates/state.json'
        if request.method == 'POST':
            # request is a POST request
            upload = request.FILES['upload']
            print(upload)
            uploadName = upload.name

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
                if prev and not new:
                    # send save state that matches user and game
                    print('previous save')
                    saveState = SaveState.objects.filter(user=request.user, game=game)[0]
                    chars = saveState.data[1:-1].replace("\\", "")
                    with open(tempfile, 'w') as f:
                        f.write(chars)
                    bytes = open(os.path.join(settings.BASE_DIR, tempfile),'rb')
                    response = FileResponse(bytes)
                else:
                    # send blank new game
                    bytes = open(os.path.join(settings.BASE_DIR, f'genone/roms/{title}'), 'rb') 
                    response = FileResponse(bytes)
            except Exception as e:
                print(e)
                response = JsonResponse({
                    'response': 'unsuccessful download',
                    'status': 200,
                })
    else:
        response = HttpResponse('nice try, guy.')
    return response

@csrf_exempt
def load_save_game(request, savefile):
    if request.user.is_superuser:
        tempfile = 'genone/roms/savestates/state.json'

        if request.method == 'POST':
            upload = request.FILES['upload']
            uploadName = upload.name
            gameName = uploadName.split('_')[1].split('.')[0]

            game = Game.objects.get(version=gameName)

            try:
                contents = handle_uploaded_file(upload, tempfile)

                # check for existing savestate
                if len(SaveState.objects.filter(user=request.user, game=game)) > 0:
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
            try:
                gameName = savefile.split('_')[1].split('.')[0]
                game = Game.objects.filter(version=gameName)[0]

                saveState = SaveState.objects.filter(user=request.user, game=game)[0]
                chars = saveState.data[1:-1].replace("\\", "")
                with open(tempfile, 'w') as f:
                    f.write(chars)
                
                bytes = open(os.path.join(settings.BASE_DIR, tempfile),'rb')
                response = FileResponse(bytes)

            except Exception as e:
                print(e)
                response = JsonResponse({
                    'response': 'unsuccessful download',
                    'status': 200,
                })
    else:
        response = HttpResponse('nice try, guy.')

    return response

def wtp(request):
    return auth_check(request, 'wtp.html', context={})
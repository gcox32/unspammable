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
            gameName = title.split('.')[0] # from "new-red.gb"
            gameName = gameName.split('-')[1]
            title = title.split('-')[1]
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

def wtp(request):

    # from .models import SaveState
    # import json

    # yellow = SaveState.objects.get(pk=2)
    # data = yellow.data[1:-1].replace("\\", "")
    # json_data = json.loads(data)
    # idx = 0
    # for i in json_data:
    #     if type(i) == list:
    #         ln = f' ({len(i)})'
    #     else:
    #         ln = ''
    #     print(idx,': ', ' ', type(i), ln)
        
    #     if idx == 23:
    #         print(i)
    #         for j in range(len(i)):
    #             if [i[j], i[j+1], i[j+2], i[j+3], i[j+4], i[j+5]] == [84, 255, 0, 0, 0, 0]:
    #                 print('start index: ', j)
    #                 break
    #     idx += 1

    return auth_check(request, 'wtp.html', context={})
from django.shortcuts import render
from unspammable.src.auth import auth_check
from .src.dbUtils import *
from .src.timeline import timeline_list
from .models import Platform, Credential


def home(request):
    platforms = Platform.objects.values()

    try:
        credentials = Credential.objects.filter(user_id=request.user.id).values_list()
        credentials = list(credentials)
    except:
        credentials = [None]
    
    context = {
        'platforms':platforms,
        'credentials':credentials,
    }
    return auth_check(request, 'marvelHome.html', context=context)

def timeline(request):
    return auth_check(request, 'timeline.html', context={'phases': timeline_list})

def phase(request, n):
    n = int(n)
    context = timeline_list[n]
    title_list = movies_by_phase(n)

    try:
        credentials = Credential.objects.filter(user_id=request.user.id).values_list()
        credentials = list(credentials)
    except:
        credentials = [None]
        
    context['titles'] = title_list
    context['platforms'] = Platform.objects.values()
    context['credentials'] = credentials

    return auth_check(request, 'phase.html', context=context)
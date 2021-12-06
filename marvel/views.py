from django.shortcuts import render
from unspammable.src.auth import auth_check
from .src.dbUtils import *
from .src.timeline import timeline_list
from .models import Platform, Credential


def get_platforms_credentials(request):
    """helper function for loading in creds"""
    platforms = Platform.objects.values()
    try:
        credentials = Credential.objects.filter(user_id=request.user.id).values_list()
        credentials = list(credentials)
    except:
        credentials = [None]
    context = {
        'platforms': platforms,
        'credentials': credentials,
    }
    return context

def home(request):
    context = get_platforms_credentials(request)
    return auth_check(request, 'marvelHome.html', context=context)

def recommend(request):
    context = get_platforms_credentials(request)
    context['background'] = '/staticfiles/marvel/images/lab-background.jpg'
    return auth_check(request, 'recommender.html', context=context)

def timeline(request):
    context = get_platforms_credentials(request)
    context['phases'] = timeline_list
    return auth_check(request, 'timeline.html', context=context)

def phase(request, n):
    n = int(n)
    context = timeline_list[n]
    title_list = movies_by_phase(n)
    creds = get_platforms_credentials(request)

    context['titles'] = title_list
    context['platforms'] = creds['platforms']
    context['credentials'] = creds['credentials']

    return auth_check(request, 'phase.html', context=context)
from django.shortcuts import render
from unspammable.src.auth import auth_check
from .src.dbUtils import *
from .src.timeline import timeline_list

def home(request):
    return auth_check(request, 'marvelHome.html')

def timeline(request):
    return auth_check(request, 'timeline.html', context={'phases': timeline_list})

def phase(request, n):
    n = int(n)
    context = timeline_list[n]
    title_list = movies_by_phase(n)
    context['titles'] = title_list

    return auth_check(request, 'phase.html', context=context)
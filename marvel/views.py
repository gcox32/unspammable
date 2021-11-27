from django.shortcuts import render
from django.http import HttpResponseRedirect
from .src.dbUtils import *


def timeline(request):
    if request.user.is_authenticated:
        return render(request, 'timeline.html')
    else:
        return HttpResponseRedirect('/accounts/login')

def phase(request, n):
    if request.user.is_authenticated:
        n = int(n)
        phase_list = [
            {'background': '/staticfiles/marvel/images/phase-0-original-x-men.jpg',},
            {'background': '/staticfiles/marvel/images/phase-1-three-part.jpg',},
            {'background': '/staticfiles/marvel/images/phase-2-age-of-ultron.jfif',},
            {'background': '/staticfiles/marvel/images/phase-3-endgame.jpg',},
            {'background': '/staticfiles/marvel/images/phase-4-summary.jpg',}
            ]
        context = phase_list[n]
        title_list = movies_by_phase(n)
        context['titles'] = title_list


        return render(request, 'phase.html', context=context)
    else:
        return HttpResponseRedirect('/accounts/login')
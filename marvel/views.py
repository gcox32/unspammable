from django.shortcuts import render
from unspammable.src.auth import auth_check
from .src.dbUtils import *
from .src.timeline import timeline_list
from unspammable.src.creds import get_platforms_credentials
from marvel.models import Series, Movie

def home(request):
    context = get_platforms_credentials(request)
    return auth_check(request, 'marvel_home.html', context=context)

def recommend(request):
    context = get_platforms_credentials(request)
    context['background'] = '/staticfiles/marvel/images/JARVIS/lab-background.jpg'
    try:
        search = request.GET['search-terms']
    except:
        search = None
    if search:
        try:
            movies = list(Movie.objects.filter(title_text__icontains=search))
        except:
            movies = []
        try:
            series = list(Series.objects.filter(title_text__icontains=search))
        except:
            series = []
        suggestions = movies + series
    else:
        suggestions = []

    context['suggestions'] = suggestions

    return auth_check(request, 'recommender.html', context=context)

def timeline(request):
    context = get_platforms_credentials(request)
    context['phases'] = timeline_list
    return auth_check(request, 'timeline.html', context=context)

def phase(request, n):
    n = int(n)
    context = timeline_list[n]
    movie_list = list(Movie.objects.filter(phase=n))
    series_list = list(Series.objects.filter(phase=n))
    creds = get_platforms_credentials(request)

    titles = movie_list + series_list

    context['titles'] = sorted(titles, key=lambda i: i.release_date)
    context['platforms'] = creds['platforms']
    context['credentials'] = creds['credentials']

    return auth_check(request, 'phase.html', context=context)
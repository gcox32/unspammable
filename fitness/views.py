from django.shortcuts import render
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials

# Create your views here.

def home(request):
    context = get_platforms_credentials(request)
    fitness = request.user.profile.fitness_profile
    context['fitness'] = fitness
    print(fitness.strength)

    return auth_check(request, 'fitness_home.html', context=context)

def measurements(request):
    pass

def training(request):
    pass

def dashboard(request):
    pass

def program(request):
    pass
from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from unspammable.src.auth import auth_check
from django.shortcuts import render
from .src.creds import get_platforms_credentials

def index(request):
    context = get_platforms_credentials(request)
    return auth_check(request, 'home.html', context=context)
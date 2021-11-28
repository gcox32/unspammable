from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from unspammable.src.auth import auth_check
from django.shortcuts import render

def index(request):
    return auth_check(request, 'home.html')
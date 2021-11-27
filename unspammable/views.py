from django.http import HttpResponseRedirect
from django.http.response import HttpResponse
from django.shortcuts import render

def index(request):
    if request.user.is_authenticated:
        return render(request, 'home.html')
    else:
        return HttpResponseRedirect('/accounts/login')
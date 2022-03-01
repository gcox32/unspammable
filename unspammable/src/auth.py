from django.shortcuts import render
from django.http import HttpResponseRedirect

def auth_check(request, template, context=None, redirect='/'):
    if request.user.is_authenticated:
        return render(request, template, context)
    else:
        return HttpResponseRedirect(redirect)
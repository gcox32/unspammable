from unspammable.src.auth import auth_check
from django.shortcuts import render
from .src.creds import get_platforms_credentials
from django.contrib.auth.views import LoginView as AuthLoginView

def index(request):
    
    context = get_platforms_credentials(request)
    return render(request, 'home.html', context=context)

class Home(AuthLoginView):
    success_url = '/'
    template_name = 'home.html'




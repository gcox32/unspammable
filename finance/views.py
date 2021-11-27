from django.shortcuts import render
from django.http import HttpResponseRedirect
from .src.news import finnhub_client

def dashboard(request):
    if request.user.is_authenticated:
        general_news = finnhub_client.general_news('general', min_id=0)
        gen_news_dict = {'news':general_news[:10]}
        return render(request,'dashboard.html',gen_news_dict)
    else:
        return HttpResponseRedirect('/accounts/login')
def giving(request):
    pass
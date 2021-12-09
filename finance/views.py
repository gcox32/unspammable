from django.shortcuts import render
# from .src.news import finnhub_client
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials

def home(request):
    context = get_platforms_credentials(request)
    return auth_check(request, 'finance_home.html', context=context)

# def dashboard(request):
#     general_news = finnhub_client.general_news('general', min_id=0)
#     gen_news_dict = {'news':general_news[:10]}
#     return auth_check(request,'dashboard.html',context=gen_news_dict)

def giving(request):
    pass
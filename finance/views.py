from django.shortcuts import render
from .src.news import finnhub_client

def dashboard(request):
    general_news = finnhub_client.general_news('general', min_id=0)
    gen_news_dict = {'news':general_news[:10]}
    return render(request,'dashboard.html',gen_news_dict)
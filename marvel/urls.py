from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.home, name='marvel'),
    path('timeline', views.timeline, name='timeline'),
    path('timeline/<n>', views.phase, name='phase'),
    path('recommender', views.recommend, name='recommend'),
]
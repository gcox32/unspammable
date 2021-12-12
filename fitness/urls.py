from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.home, name='fitness'),
    path('anthropometry', views.anthropometry, name='anthropometry'),
    path('training', views.training, name='training'),
    path('training/dashboard', views.dashboard, name='training-dashboard'),
    path('training/program', views.program, name='program')
]
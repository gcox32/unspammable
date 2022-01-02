from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.home, name='genone'),
    path('gbc', views.gameboy, name='gameboy'),
    path('roms/<title>', views.cartridge),
    path('roms/savestates/<savefile>', views.load_save_game),
    path('wtp', views.wtp, name='wtp')
]
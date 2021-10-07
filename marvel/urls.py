from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.timeline, name='timeline'),
    path('<n>', views.phase, name='phase'),
    # path('phaseone', views.phase(n=1), name='phaseone'),
    # path('phasetwo', views.phase(n=2), name='phasetwo'),
    # path('phasethree', views.phase(n=3), name='phasethree'),
    # path('phasefour', views.phase(n=4), name='phasefour'),
]
from . import views
from django.urls import path

urlpatterns = [
    path('', views.PostList.as_view(), name='home'),
    path('<slug>/', views.post_detail, name='post_detail'),
    path('tag/<slug>/', views.list_by_tag, name='tag-view'),
]

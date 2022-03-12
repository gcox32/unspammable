from django.shortcuts import render
from django.views import generic
from .models import Post, Tag

class PostList(generic.ListView):
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    template_name = 'blogIndex.html'

def post_detail(request, slug):
    context = {}
    context['blog'] = Post.objects.get(slug=slug)
    
    return render(request, 'postDetail.html', context)

def list_by_tag(request, slug): 
    context = {}
    tag = Tag.objects.get(slug=slug).name
    context['blog_posts'] = Post.objects.filter(tags__name=tag)

    return render(request, 'blogIndex.html', context)
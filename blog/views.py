from django.shortcuts import render
from django.views import generic
from .models import Post, Tag

class PostList(generic.ListView):
    queryset = Post.objects.filter(status=1).order_by('-created_on')
    template_name = 'blogIndex.html'

def list_by_tag(request, slug): 
    context = {}
    tag = Tag.objects.get(slug=slug).name
    context['blog_posts'] = Post.objects.filter(tags__name=tag)

    return render(request, 'blogIndex.html', context)

from .models import Post
from .forms import CommentForm
from django.shortcuts import render, get_object_or_404

def post_detail(request, slug):
    template_name = 'postDetail.html'
    post = get_object_or_404(Post, slug=slug)
    comments = post.comments.filter(active=True)
    new_comment = None

    if request.method == 'POST':
        comment_form = CommentForm(data=request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.post = post
            new_comment.save()
    else:
        comment_form = CommentForm()

    return render(request, template_name, {'post': post,
                                           'comments': comments,
                                           'new_comment': new_comment,
                                           'comment_form': comment_form})
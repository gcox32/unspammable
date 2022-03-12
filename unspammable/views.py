from unspammable.src.auth import auth_check
from django.shortcuts import render
from .src.creds import get_platforms_credentials
from django.contrib.auth.views import LoginView as AuthLoginView
from blog.models import Post
from django.contrib.sites.shortcuts import get_current_site
from .src.sql import get_posts_queryset

def index(request):
    context = get_platforms_credentials(request)
    context['blog_posts'] = Post.objects.filter(status=1).order_by('-created_on')
    return render(request, 'home.html', context=context)

class Home(AuthLoginView):
    success_url = '/'
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_site = get_current_site(self.request)

        if self.request.user.is_authenticated:
            context.update(get_platforms_credentials(self.request))

        context['blog_posts'] = get_posts_queryset()

        context.update(
            {
                self.redirect_field_name: self.get_redirect_url(),
                "site": current_site,
                "site_name": current_site.name,
                **(self.extra_context or {}),
            }
        )
        return context



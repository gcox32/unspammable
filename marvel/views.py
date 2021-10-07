from django.shortcuts import render

# Create your views here.

def timeline(request):
    return render(request, 'timeline.html')

def phase(request, n):
    n = int(n)
    phase_list = [
        {'background': '/staticfiles/marvel/images/phase-0-original-x-men.jpg',},
        {'background': '/staticfiles/marvel/images/phase-1-three-part.jpg',},
        {'background': '/staticfiles/marvel/images/phase-2-age-of-ultron.jfif',},
        {'background': '/staticfiles/marvel/images/phase-3-endgame.jpg',},
        {'background': '/staticfiles/marvel/images/phase-4-summary.jpg',}
        ]
    return render(request, 'phase.html', context=phase_list[n])
from django.shortcuts import render
from fitness.models import Workout
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
from .forms import NewExerciseEntry, NewWorkout
from .models import Exercise, Workout, WorkoutLog
from datetime import date

# Create your views here.

def home(request):
    context = get_platforms_credentials(request)

    return auth_check(request, 'fitness_home.html', context=context)

def training(request):
    if request.method == "POST":
        workoutForm = NewWorkout(request.POST)
        if workoutForm.is_valid():
            # get user's workoutlog
            workout_log = WorkoutLog.objects.get(user=request.user)
            duration = None if request.POST['duration'] == '' else request.POST['duration'] 

            # create new workout instance
            workout = Workout(
                date=request.POST['date'],
                workout_log=workout_log,
                duration=duration,
                )
            workout.save()

    return render(request, 'training.html', 
    {
        'workoutForm': NewWorkout(),
        'exercises': Exercise.objects.all(),
    })

def dashboard(request):
    pass

def program(request):
    pass

def measurements(request):
    pass
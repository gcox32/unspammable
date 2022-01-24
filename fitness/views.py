from email import message
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from fitness.models import Workout
from unspammable.src.auth import auth_check
from unspammable.src.creds import get_platforms_credentials
from .forms import NewWorkout
from .models import Exercise, ExerciseEntry, Workout, WorkoutLog
from django.contrib import messages

# Create your views here.

def home(request):
    context = get_platforms_credentials(request)

    return auth_check(request, 'fitness_home.html', context=context)

def training(request):
    if request.method == "POST":
        workoutForm = NewWorkout(request.POST)
        if workoutForm.is_valid():
            # create new workout instance
            workout = Workout(
                date=request.POST['date'],
                workout_log=WorkoutLog.objects.get(user=request.user),
                duration=None if request.POST['duration'] == '' else request.POST['duration'],
                volume=None if request.POST['form-volume'] == '' else request.POST['form-volume'],
                load_volume=None if request.POST['form-load-volume'] == '' else request.POST['form-load-volume'],

                )
            # save workout to reference with entries
            workout.save()

            # parse entry fields from POST data
            exercises, sets, reps, weights, times, dists, tempos, rpes = [], [], [], [], [], [], [], []
            for k, v in request.POST.items():
                print(k, ': ', v)
                if k.startswith('exercise'):
                    exercises.append(v)
                elif k.startswith('sets'):
                    sets.append(v)
                elif k.startswith('reps'):
                    reps.append(v)
                elif k.startswith('weight'):
                    weights.append(v)
                elif k.startswith('time'):
                    times.append(v)
                elif k.startswith('distance'):
                    dists.append(v)
                elif k.startswith('tempo'):
                    tempos.append(v)
                elif k.startswith('rpe'):
                    rpes.append(v)

            # save exercise entries
            idxs = range(1, len(exercises) + 1)
            entries = 0

            for ex, se, re, we, ti, di, te, id, rp in zip(exercises, sets, reps, weights, times, dists, tempos, idxs, rpes):
                try:
                    entry = ExerciseEntry(
                        exercise = Exercise.objects.get(pk=ex),
                        set_count = None if se == '' else int(se),
                        rep_count = None if re == '' else int(re),
                        weight = None if we == '' else float(we),
                        time = None if ti == '' else ti, 
                        distance = None if di == '' else float(di),
                        tempo = None if te == '' else te,
                        workout = workout,
                        index = id,
                        rpe = None if rp == '' else int(rp)
                    )
                    entry.save()
                    entries += 1

                except Exception as e:
                    print(e)

            return HttpResponseRedirect('/fitness', {'form': workoutForm})
        else:
            return render(request, 'training.html', 
            {
                'form': workoutForm,
                'exercises': Exercise.objects.all(),
            })
    else:
        workoutForm = NewWorkout()
        return render(request, 'training.html', 
        {
            'form': workoutForm,
            'exercises': Exercise.objects.all(),
        })

def dashboard(request):
    pass

def program(request):
    pass

def measurements(request):
    pass
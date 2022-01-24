from unittest.util import _MAX_LENGTH
from django import forms
from .models import Exercise, ExerciseEntry, Workout
from datetime import date

class NewExerciseEntry(forms.Form):
    exercise = forms.ModelChoiceField(queryset=Exercise.objects.all(), required=True)
    sets = forms.IntegerField(required=False)
    reps = forms.IntegerField(required=False)
    weight = forms.FloatField(required=False)
    time = forms.DurationField(required=False)
    distance = forms.FloatField(required=False)
    tempo = forms.CharField(required=False, max_length=4)

    class Meta:
        model = ExerciseEntry
        fields = [
            'exercise', 'sets', 'reps', 'weight', 'time', 'distance', 'tempo', 
        ]

class NewWorkout(forms.Form):
    date = forms.DateField(initial=date.today(), required=True)
    duration = forms.DurationField(required=False)
    name = forms.CharField(max_length=64, required=False)

    class Meta:
        model = Workout


from typing import Tuple
from django.db import models
from django.db.models.deletion import SET_NULL
from django.db.models.fields.related import ManyToManyField
from django.contrib.auth import get_user_model


class Exercise(models.Model):
    # exercise descriptors
    name_prefix = models.CharField(max_length=64, null=True, blank=True)
    name_base = models.CharField(max_length=64)
    equipment = models.CharField(max_length=64, null=True, blank=True)
    unilateral = models.BooleanField(blank=True, default=False)
    modality = models.CharField(max_length=64, null=True, blank=True)
    movement_type = models.CharField(max_length=64, null=True, blank=True) # e.g. 'Upper Push', 'Hinge', 'Lunge', 'Rotary'

    # goal numbers for gauging efforts
    goal_power = models.FloatField(null=True, blank=True) # in lbs
    goal_strength = models.FloatField(null=True, blank=True) # in lbs*(reps <= 5) (load-volume)
    goal_stamina = models.FloatField(null=True, blank=True) # in lbs*(reps > 5) (load-volume)
    goal_endurance = models.FloatField(null=True, blank=True) # in seconds
    goal_speed = models.FloatField(null=True, blank=True) # in seconds

    # correlation with muscle group
    corr_chest = models.FloatField(default=0.0, blank=True)
    corr_shoulders = models.FloatField(default=0.0, blank=True)
    corr_biceps = models.FloatField(default=0.0, blank=True)
    corr_tricps = models.FloatField(default=0.0, blank=True)
    corr_forearms = models.FloatField(default=0.0, blank=True)
    corr_neck = models.FloatField(default=0.0, blank=True)
    corr_abs = models.FloatField(default=0.0, blank=True)
    corr_traps = models.FloatField(default=0.0, blank=True)
    corr_rhomboids = models.FloatField(default=0.0, blank=True)
    corr_lats = models.FloatField(default=0.0, blank=True)
    corr_obliques = models.FloatField(default=0.0, blank=True)
    corr_quads = models.FloatField(default=0.0, blank=True)
    corr_hamstrings = models.FloatField(default=0.0, blank=True)
    corr_glutes = models.FloatField(default=0.0, blank=True)
    corr_calves = models.FloatField(default=0.0, blank=True)
    
class Workout(models.Model):
    workout_date = models.DateField()
    exercise = models.ManyToManyField(
        Exercise
    )
    set_count = models.IntegerField(null=True, blank=True)
    rep_count = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True) # in pounds
    time = models.FloatField(null=True, blank=True) # in seconds
    distance = models.FloatField(null=True, blank=True) # in meters

class Measurement(models.Model):
    date = models.DateField()
    measure_text = models.CharField(max_length=64)
    measure = models.FloatField(null=True, blank=True)
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=SET_NULL
    )

class Fitness(models.Model):
    date = models.DateField()
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=SET_NULL
    )

    power = models.FloatField(null=True, blank=True)
    strength = models.FloatField(null=True, blank=True)
    stamina = models.FloatField(null=True, blank=True)
    endurance = models.FloatField(null=True, blank=True)
    speed = models.FloatField(null=True, blank=True)

    measurements = models.ManyToManyField(
        Measurement
    )

    def __str__(self):
        return self.user.username + ' fitness profile'
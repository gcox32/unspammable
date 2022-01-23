from django.contrib import admin
from .models import *
from django.utils.html import format_html

class ExerciseAdmin(admin.ModelAdmin):
    model = Exercise
    list_display = ['__str__', 'movement_type', 'unilateral']

    list_filter = ('movement_type', 'equipment')

class GoalAdmin(admin.ModelAdmin):
    model = Goal
    list_display = ['_exercise', '_power', '_strength', '_stamina', '_endurance', '_speed']

    def _power(self, obj):
        return obj.goal_power
    def _strength(self, obj):
        return obj.goal_strength
    def _stamina(self, obj):
        return obj.goal_stamina
    def _endurance(self, obj):
        return obj.goal_endurance
    def _speed(self, obj):
        return obj.goal_speed

    _power.short_description = 'Power Goal'
    _strength.short_description = 'Strength Goal'
    _stamina.short_description = 'Stamina Goal'
    _endurance.short_description = 'Endurance Goal'
    _speed.short_description = 'Speed Goal'

    list_filter = ('user',)

class ExerciseEntryAdmin(admin.ModelAdmin):
    model = ExerciseEntry
    list_display = ['index', '__str__', 'workout', '_date']

    ordering = ('index',)
    def _date(self, obj):
        return obj.workout.date

class WorkoutAdmin(admin.ModelAdmin):
    model = Workout
    list_display = ['date', '_entries', 'duration', '_load_volume', 'user']

    def user(self, obj):
        return obj.workout_log.user

    def _load_volume(self, obj):
        return f'{obj.load_volume} lbs'

    def _entries(self, obj):
        text = obj.exerciseentry_set.count()
        url = (
            '/admin/fitness/exerciseentry/?' +
            f'workout__id__exact={obj.id}'
        )
        return format_html('<a href="{}">{} exercises</a>', url, text)

    list_filter = ('workout_log',)

class WorkoutLogAdmin(admin.ModelAdmin):
    model = WorkoutLog
    list_display = ['user']

class MeasurementEntryAdmin(admin.ModelAdmin):
    model = MeasurementEntry

    list_filter = ('measurement_log',)

class MeasurementLogAdmin(admin.ModelAdmin):
    model = MeasurementLog
    list_display = ['user']

class FitnessEntryAdmin(admin.ModelAdmin):
    model = FitnessEntry

    list_filter = ('fitness_log',)

class FitnessLogAdmin(admin.ModelAdmin):
    model = FitnessLog

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Goal, GoalAdmin)
admin.site.register(ExerciseEntry, ExerciseEntryAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(WorkoutLog, WorkoutLogAdmin)
admin.site.register(MeasurementLog, MeasurementLogAdmin)
admin.site.register(MeasurementEntry, MeasurementEntryAdmin)
admin.site.register(FitnessEntry, FitnessEntryAdmin)
admin.site.register(FitnessLog, FitnessLogAdmin)
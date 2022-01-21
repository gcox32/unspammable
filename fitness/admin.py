from django.contrib import admin
from .models import *

class ExerciseAdmin(admin.ModelAdmin):
    model = Exercise
    list_display = ['__str__', 'movement_type', 'unilateral']

    list_filter = ('movement_type', 'equipment')

admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(Workout)
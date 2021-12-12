from django.db import models

# Create your models here.
class Exercise(models.Model):
    base_name = models.CharField(max_length=64)
    
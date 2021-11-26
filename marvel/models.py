from django.db import models
from django.contrib.auth import get_user_model

class Platform(models.Model):
    name_text = models.CharField(max_length=64)
    url = models.CharField(max_length=256)

    def __str__(self):
        return self.name_text

class Credential(models.Model):
    password = models.CharField(max_length=256)
    username = models.CharField(max_length=256)
    
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    platform = models.ForeignKey(
        Platform,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.platform + '_creds'

class Phase(models.Model):
    name_text = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return self.name_text

class Movie(models.Model):
    title_text = models.CharField(max_length=64)
    release_date = models.DateField(null=True, blank=True)
    url = models.CharField(max_length=256, null=True, blank=True)
    image = models.CharField(max_length=256, null=True, blank=True)
    phase = models.ForeignKey(
        Phase, 
        null=True, 
        blank=True,
        on_delete=models.SET_NULL)
    
    platform = models.ForeignKey(
        Platform,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return self.title_text

class Series(models.Model):
    title_text = models.CharField(max_length=64)
    release_date = models.DateField(null=True, blank=True)
    phase = models.CharField(max_length=64, null=True, blank=True)
    
    platform = models.ForeignKey(
        Platform,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

class Character(models.Model):
    alias_text = models.CharField(max_length=64)
    first_name = models.CharField(max_length=64, null=True, blank=True)
    last_name = models.CharField(max_length=64, null=True, blank=True)

    movie = models.ManyToManyField(
        Movie,
    )
    series = models.ManyToManyField(
        Series,
    )
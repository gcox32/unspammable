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
        return self.platform.name_text + '_creds'

class Phase(models.Model):
    name_text = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return self.name_text

class Movie(models.Model):
    title_text = models.CharField(max_length=64)
    release_date = models.DateField(null=True, blank=True)
    url = models.CharField(max_length=256, null=True, blank=True)
    image = models.CharField(max_length=256, null=True, blank=True)
    directors = models.CharField(max_length=256, null=True, blank=True)
    screenwriters = models.CharField(max_length=256, null=True, blank=True)
    producers = models.CharField(max_length=256, null=True, blank=True)
    description = models.CharField(max_length=1024, null=True, blank=True)
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
        release_date = self.release_date
        try:
            release_year = release_date.year
            return self.title_text + f' ({release_year})'
        except:
            return self.title_text

class Series(models.Model):
    title_text = models.CharField(max_length=64)
    release_date = models.DateField(null=True, blank=True)
    url = models.CharField(max_length=256, null=True, blank=True)
    image = models.CharField(max_length=256, null=True, blank=True)
    description = models.CharField(max_length=1024, null=True, blank=True)
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

    def __str__(self):
        return self.alias_text
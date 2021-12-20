from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.deletion import SET_NULL

class Security(models.Model):
    asset_class = models.CharField(max_length=64, null=True, blank=True) # e.g. stock, bond
    ticker = models.CharField(max_length=16, null=True, blank=True)
    full_name = models.CharField(max_length=64, null=True, blank=True)
    sector = models.CharField(max_length=64, null=True, blank=True)
    industry = models.CharField(max_length=64, null=True, blank=True)
    amount = models.FloatField(null=True, blank=True)

class Account(models.Model):
    institution = models.CharField(max_length=64, null=True, blank=True)
    securities = models.ManyToManyField(
        Security
    )
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=SET_NULL
    )

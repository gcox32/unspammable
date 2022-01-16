from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.deletion import SET_NULL


class Institution(models.Model):
    name = models.CharField(max_length=64, null=True, blank=True) # e.g. Fidelity, Coin Base

class Account(models.Model):
    type_text = models.CharField(max_length=64, null=True, blank=True) # e.g. Roth IRA, Taxable Brokerage
    institution = models.ForeignKey(
        Institution,
        null=True,
        blank=True,
        on_delete=SET_NULL
    )
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=SET_NULL
    )

class Security(models.Model):
    asset_class = models.CharField(max_length=64, null=True, blank=True) # e.g. stock, bond
    ticker = models.CharField(max_length=16, null=True, blank=True)
    full_name = models.CharField(max_length=64, null=True, blank=True)
    sector = models.CharField(max_length=64, null=True, blank=True)
    industry = models.CharField(max_length=64, null=True, blank=True)
    amount = models.FloatField(null=True, blank=True)
    account = models.ForeignKey(
        Account,
        null=True,
        blank=True,
        on_delete=SET_NULL
    )

    class Meta:
        verbose_name_plural = "Securities"


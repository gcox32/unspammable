from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import SET_NULL
from django.db.models.signals import post_save
from django.dispatch import receiver
from fitness.models import Fitness
from marvel.models import Credential

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    fitness_profile = models.ForeignKey(
        Fitness,
        null=True,
        blank=True,
        on_delete=SET_NULL
    )
    credentials = models.ManyToManyField(
        Credential,
    )
    def __str__(self):
        return self.user.username + ' profile'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.deletion import SET_NULL


class Game(models.Model):
    name_text = models.CharField(max_length=64)
    image = models.CharField(max_length=128, null=True, blank=True)
    file_loc = models.CharField(max_length=128)
    version = models.CharField(max_length=16, null=True, blank=True)

    def __str__(self):
        return self.name_text

class SaveState(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=SET_NULL
    )
    game = models.ForeignKey(
        Game,
        null=True,
        blank=True,
        on_delete=SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.user) + '_' + self.game
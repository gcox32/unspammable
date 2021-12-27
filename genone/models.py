from django.db import models

class Game(models.Model):
    name_text = models.CharField(max_length=64)
    image = models.CharField(max_length=128, null=True, blank=True)
    file_loc = models.CharField(max_length=128)
    version = models.CharField(max_length=16, null=True, blank=True)

    def __str__(self):
        return self.name_text


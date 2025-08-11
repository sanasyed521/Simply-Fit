from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    fitness_goal = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username
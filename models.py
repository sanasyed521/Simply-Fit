# models.py
from django.db import models
from django.contrib.auth.models import User

class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_name = models.CharField(max_length=255)
    calories = models.IntegerField()
    protein = models.IntegerField()
    carbs = models.IntegerField()
    fat = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

class Workout(models.Model):
    WORKOUT_TYPES = [
        ('cardio', 'Cardio'),
        ('strength', 'Strength Training'),
        ('flexibility', 'Flexibility'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    duration = models.IntegerField()  # in minutes
    intensity = models.CharField(max_length=20)
    calories_burned = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
# server/api/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_name = models.CharField(max_length=255)
    calories = models.IntegerField()
    meal_date = models.DateField()
    meal_time = models.TimeField(auto_now_add=True)

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_type = models.CharField(max_length=255)
    workout_minutes = models.IntegerField()
    calories_burned = models.IntegerField()
    workout_date = models.DateField()

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal_type = models.CharField(max_length=255)
    target_goal = models.CharField(max_length=255)
    goal_start = models.DateField()
    goal_end = models.DateField()
    goal_complete = models.BooleanField(default=False)

class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    progress_metric = models.CharField(max_length=255)
    progress_value = models.DecimalField(max_digits=10, decimal_places=2)
    progress_record = models.DateTimeField(auto_now_add=True)
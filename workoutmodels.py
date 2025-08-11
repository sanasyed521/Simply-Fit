from django.db import models
from users.models import CustomUser

WORKOUT_TYPES = [
    ('cardio', 'Cardio'),
    ('strength', 'Strength Training'),
    ('flexibility', 'Flexibility'),
    ('balance', 'Balance'),
]

class Workout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    workout_type = models.CharField(max_length=20, choices=WORKOUT_TYPES)
    duration = models.IntegerField(help_text="Duration in minutes")
    intensity = models.CharField(max_length=20)
    calories_burned = models.IntegerField()
    date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.workout_type} - {self.date}"
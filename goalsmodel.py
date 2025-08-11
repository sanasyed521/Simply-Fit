from django.db import models
from users.models import CustomUser

GOAL_TYPES = [
    ('weight', 'Weight'),
    ('calories', 'Calories'),
    ('workout', 'Workout Frequency'),
    ('steps', 'Steps'),
]

class Goal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    goal_type = models.CharField(max_length=20, choices=GOAL_TYPES)
    target_value = models.FloatField()
    current_value = models.FloatField(default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    is_achieved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-end_date']

    def __str__(self):
        return f"{self.goal_type} - {self.target_value}"
from rest_framework import serializers
from .models import Workout

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'workout_type', 'duration', 'intensity', 'calories_burned', 'date', 'notes']
        read_only_fields = ['id']
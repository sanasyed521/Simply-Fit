from rest_framework import serializers
from .models import Meal

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = ['id', 'name', 'description', 'calories', 'protein', 'carbs', 'fat', 'date', 'time']
        read_only_fields = ['id']
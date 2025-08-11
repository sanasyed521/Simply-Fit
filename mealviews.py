from rest_framework import viewsets, permissions
from .models import Meal
from .serializers import MealSerializer
from users.models import CustomUser

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Meal.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
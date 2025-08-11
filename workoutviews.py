from rest_framework import viewsets, permissions
from .models import Workout
from .serializers import WorkoutSerializer
from users.models import CustomUser

class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Workout.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
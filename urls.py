# server/simplyfit/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UserViewSet, MealViewSet, WorkoutViewSet, GoalViewSet, ProgressViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'meals', MealViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'goals', GoalViewSet)
router.register(r'progress', ProgressViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from meals import views as meal_views
from workouts import views as workout_views
from goals import views as goal_views

router = routers.DefaultRouter()
router.register(r'meals', meal_views.MealViewSet)
router.register(r'workouts', workout_views.WorkoutViewSet)
router.register(r'goals', goal_views.GoalViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
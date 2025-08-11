import os
from dotenv import load_dotenv

load_dotenv()

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'corsheaders',
    'users',
    'meals',
    'workouts',
    'goals',
]

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'simplyfit',
        'USER': 'simplyfit_user',
        'PASSWORD': 'securepassword123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
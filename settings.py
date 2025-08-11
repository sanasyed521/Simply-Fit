# server/simplyfit/settings.py

INSTALLED_APPS = [
    # ...
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...
]

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'simplyfit',
        'USER': 'simplyfit',
        'PASSWORD': 'simplyfit',
        'HOST': 'db',
        'PORT': '5432',
    }
}

# Authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True  # For development only
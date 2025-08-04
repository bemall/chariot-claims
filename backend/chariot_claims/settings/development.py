from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Development database
DATABASES = {
    'default': env.db(
        'DATABASE_URL',
        default='postgresql://chariot:Klaims4u#@db:5432/chariot_claims'
    )
}

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

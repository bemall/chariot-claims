import os
import environ
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BASE_DIR.parent

# Initialize environ
env = environ.Env(DEBUG=(bool, False))

# Try to read .env from multiple locations, prioritizing local development
if not (os.path.exists("/.dockerenv") or os.environ.get("DOCKER_CONTAINER", False)):
    # For local development, prioritize .env.local
    env_file_locations = [
        ROOT_DIR / '.env.local',     # project_root/.env.local (local development)
        BASE_DIR / '.env.local',     # backend/.env.local
        ROOT_DIR / '.env',           # project_root/.env (fallback)
        BASE_DIR / '.env',           # backend/.env (fallback)
        Path.cwd() / '.env',         # current directory (fallback)
    ]
else:
    # For Docker, use standard .env files
    env_file_locations = [
        BASE_DIR / '.env',           # backend/.env
        ROOT_DIR / '.env',           # project_root/.env
        Path.cwd() / '.env',         # current directory
    ]

for env_file in env_file_locations:
    if env_file.exists():
        environ.Env.read_env(str(env_file))
        print(f"Loaded environment from: {env_file}")
        break
else:
    print("Warning: No .env file found in expected locations")

# Detect if running in Docker (needed for database configuration)
IN_DOCKER = os.path.exists("/.dockerenv") or os.environ.get("DOCKER_CONTAINER", False)

# Core settings
SECRET_KEY = env(
    "DJANGO_SECRET_KEY", default="django-insecure-change-this-in-production"
)
DEBUG = env.bool("DJANGO_DEBUG", default=False)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=[])

# Application definition
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
]

LOCAL_APPS = [
    "apps.accounts",
    "apps.payments",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "chariot_claims.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "chariot_claims.wsgi.application"

# Database configuration with Docker detection
if IN_DOCKER:
    # Inside Docker: use service names
    DATABASES = {
        "default": {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": env("POSTGRES_DB", default="chariot_claims"),
            "USER": env("POSTGRES_USER", default="chariot"),
            "PASSWORD": env("POSTGRES_PASSWORD", default="Pazzword#"),
            "HOST": "db",  # Docker service name
            "PORT": "5432",  # Internal port
        }
    }
    REDIS_HOST = "redis"
    REDIS_PORT = "6379"
else:
    # Local development: use localhost with exposed ports
    DATABASES = {
        "default": {
            "ENGINE": "django.contrib.gis.db.backends.postgis",
            "NAME": env("POSTGRES_DB", default="chariot_claims"),
            "USER": env("POSTGRES_USER", default="chariot"),
            "PASSWORD": env("POSTGRES_PASSWORD", default="Pazzword#"),
            "HOST": "localhost",  # Local host
            "PORT": "5442",  # Exposed port
        }
    }
    REDIS_HOST = "localhost"
    REDIS_PORT = "6389"

# Redis URL construction
REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

# Cache configuration
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": REDIS_URL,
    }
}

# Celery configuration
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = "UTC"

# Custom user model
AUTH_USER_MODEL = "accounts.CustomUser"
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 100,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3010",
    "http://127.0.0.1:3010",
]

# Spectacular settings
SPECTACULAR_SETTINGS = {
    "TITLE": "Chariot Claims API",
    "DESCRIPTION": "API for managing claims and payments",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": env("LOG_LEVEL", default="INFO"),
    },
}

# Debug: Print environment info
if DEBUG:
    print(f"Running in Docker: {IN_DOCKER}")
    print(
        f"Database Host: {DATABASES['default']['HOST']}:{DATABASES['default']['PORT']}"
    )
    print(f"Redis URL: {REDIS_URL}")

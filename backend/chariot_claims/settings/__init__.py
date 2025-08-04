import os
import importlib

# Get environment from env variable, default to development
environment = os.environ.get('ENVIRONMENT', 'development')

# Dynamically import the settings module
try:
    settings_module = importlib.import_module(f'.{environment}', package='chariot_claims.settings')
    globals().update({k: v for k, v in settings_module.__dict__.items() if not k.startswith('_')})
except ImportError:
    raise ImportError(f"Could not import settings for environment '{environment}'. "
                     f"Make sure the file 'chariot_claims/settings/{environment}.py' exists.")

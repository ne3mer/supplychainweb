"""
Django settings for Vercel build process.
This file contains simplified settings that use SQLite 
to avoid PostgreSQL dependency during builds.
"""

from .settings import *  # Import the original settings

# Override database settings to use SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
} 
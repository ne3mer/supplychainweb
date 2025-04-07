#!/bin/bash

# Print Python version and location for debugging
which python3
python3 --version

# Install minimal dependencies for build
echo "Installing minimal dependencies for build..."
pip3 install -r requirements-dev.txt

# Make migrations with SQLite using custom settings
echo "Running migrations..."
DJANGO_SETTINGS_MODULE=ethicsupply.vercel_settings python3 manage.py makemigrations
DJANGO_SETTINGS_MODULE=ethicsupply.vercel_settings python3 manage.py migrate

# Collect static files
echo "Collecting static files..."
DJANGO_SETTINGS_MODULE=ethicsupply.vercel_settings python3 manage.py collectstatic --noinput 
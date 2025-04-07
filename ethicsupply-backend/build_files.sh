#!/bin/bash

# Print Python version and location for debugging
which python3
python3 --version

# Install minimal dependencies for build
echo "Installing minimal dependencies for build..."
pip3 install -r requirements-dev.txt

# Make migrations
echo "Running migrations..."
python3 manage.py makemigrations
python3 manage.py migrate

# Collect static files
echo "Collecting static files..."
python3 manage.py collectstatic --noinput 
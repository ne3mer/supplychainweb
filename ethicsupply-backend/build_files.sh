#!/bin/bash

# Make the script executable
chmod +x build_files.sh

echo "Python version:"
python3 --version

# Install dependencies
echo "Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Collect static files
echo "Collecting static files..."
python3 manage.py collectstatic --noinput

# Run migrations
echo "Running migrations..."
python3 manage.py migrate

echo "Build completed successfully!" 
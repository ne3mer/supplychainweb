#!/bin/bash

# Make the script executable
chmod +x build_files.sh

echo "Python version:"
python3 --version

# Create static folders
mkdir -p static staticfiles

# Install dependencies
echo "Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Create a dummy file in the staticfiles directory
echo "Creating staticfiles..."
echo "/* Dummy file */" > staticfiles/style.css
echo "/* Dummy file */" > static/style.css

# Copy static file to staticfiles
cp -r static/* staticfiles/

echo "Skipping collectstatic and migrate commands in build since SQLite3 module is missing on Vercel"
echo "Database operations will be handled by the PostgreSQL connection during runtime"

echo "Build completed successfully!" 
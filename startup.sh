#!/bin/bash

# Start the vulnerable Juice Shop Docker container in the background
echo "Starting Juice Shop (vulnerable site) on port 5000..."
docker run --rm -p 127.0.0.1:5000:3000 bkimminich/juice-shop &

# Give Docker a couple of seconds to initialize
sleep 2

# Activate the Python virtual environment and start the Django backend on port 8000
echo "Starting Django backend on port 8000..."
source backend/venv/bin/activate
# Navigate to the directory containing manage.py and run the server
(cd backend/pentai && python manage.py runserver 8000) &

# Start the React frontend (default runs on port 3000)
echo "Starting React frontend on port 3000..."
(cd frontend && npm start) &

# Wait for all background jobs (prevents the script from exiting immediately)
wait
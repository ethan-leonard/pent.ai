#!/bin/bash

# Remove the existing Docker network if it exists
echo "Removing existing Docker network (if any)..."
docker network rm pentai-network 2>/dev/null || true

# Create a Docker network for container communication
echo "Creating Docker network for containers..."
docker network create pentai-network

# Start the vulnerable Juice Shop Docker container in the background
echo "Starting Juice Shop (vulnerable site) on port 5000..."
docker run --rm --network pentai-network --name juice-shop -p 5000:3000 bkimminich/juice-shop &

# Give Docker a couple of seconds to initialize
sleep 3

# Start OWASP ZAP in daemon mode on port 8090 with proper API access configuration
echo "Starting OWASP ZAP on port 8090..."
docker run --rm --network pentai-network --name zap -p 8090:8090 -i zaproxy/zap-stable zap.sh -daemon -port 8090 -host 0.0.0.0 -config api.disablekey=true -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true &


# Wait longer for ZAP to fully initialize
echo "Waiting for ZAP to initialize (15 seconds)..."
sleep 15

# Activate the Python virtual environment and start the Django backend on port 8000
echo "Starting Django backend on port 8000..."
source backend/venv/bin/activate

# Navigate to the directory containing manage.py and run the server
(cd backend/pentai && python manage.py runserver 0.0.0.0:8000) &

# Start the React frontend (default runs on port 3000)
echo "Starting React frontend on port 3000..."
(cd frontend && npm start) &

# Wait for all background jobs (prevents the script from exiting immediately)
wait
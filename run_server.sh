#!/bin/bash
echo "Starting TechnoviaX Backend Server..."
echo

# Check if venv exists
if [ ! -f "venv/bin/activate" ]; then
    echo "Virtual environment not found!"
    echo "Run ./setup_venv.sh first"
    exit 1
fi

# Activate venv
source venv/bin/activate

# Check if server.py exists
if [ ! -f "backend/server.py" ]; then
    echo "Server file not found at backend/server.py"
    exit 1
fi

# Start server
echo "Server starting at http://localhost:5000"
echo "Press Ctrl+C to stop"
echo
python backend/server.py
#!/bin/bash
echo "Setting up Python Virtual Environment..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed! Please install Python 3.8+ first."
    exit 1
fi

# Install virtualenv
pip3 install virtualenv

# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn python-multipart firebase-admin pydantic

echo
echo "============================================"
echo "Virtual Environment Setup Complete!"
echo "============================================"
echo
echo "To activate: source venv/bin/activate"
echo "To deactivate: deactivate"
echo
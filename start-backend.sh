#!/bin/bash
# TaskPro Quick Start Script for macOS/Linux
# This script helps set up and run TaskPro backend

echo "============================================"
echo "  TaskPro - AI Task Management System"
echo "  Quick Start Script"
echo "============================================"
echo ""

# Check Python installation
echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed"
    echo "Please install Python 3.8+ from python.org"
    exit 1
fi
python3 --version
echo ""

# Navigate to backend
echo "[2/5] Navigating to backend directory..."
if [ ! -d "backend" ]; then
    echo "ERROR: backend directory not found"
    echo "Make sure you run this script from the TaskPro root directory"
    exit 1
fi
cd backend
echo "Backend directory ready."
echo ""

# Create virtual environment
echo "[3/5] Setting up virtual environment..."
if [ ! -d "venv" ]; then
    echo "Creating new virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists."
fi
echo ""

# Activate virtual environment
echo "[4/5] Activating virtual environment..."
source venv/bin/activate
echo "Virtual environment activated."
echo ""

# Install dependencies
echo "[5/5] Installing dependencies..."
pip install -r requirements.txt
echo ""

# Copy .env file
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ".env file created. You can edit it if needed."
fi
echo ""

# Start server
echo "============================================"
echo "  Starting TaskPro Backend Server..."
echo "============================================"
echo ""
echo "Backend will start on: http://localhost:5000"
echo ""
echo "IMPORTANT: Keep this terminal open while using TaskPro"
echo ""
echo "In another terminal, navigate to:"
echo "  TaskPro/frontend"
echo "And run:"
echo "  python3 -m http.server 8000"
echo ""
echo "Then open: http://localhost:8000/templates/auth.html"
echo ""
echo "============================================"
echo ""

python3 run.py

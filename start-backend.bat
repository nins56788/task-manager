@echo off
REM TaskPro Quick Start Script for Windows
REM This script helps set up and run TaskPro backend

echo ============================================
echo   TaskPro - AI Task Management System
echo   Quick Start Script
echo ============================================
echo.

REM Check Python installation
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)
python --version
echo.

REM Navigate to backend
echo [2/5] Navigating to backend directory...
if not exist "backend" (
    echo ERROR: backend directory not found
    echo Make sure you run this script from the TaskPro root directory
    pause
    exit /b 1
)
cd backend
echo Backend directory ready.
echo.

REM Create virtual environment
echo [3/5] Setting up virtual environment...
if not exist "venv" (
    echo Creating new virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)
echo.

REM Activate virtual environment
echo [4/5] Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated.
echo.

REM Install dependencies
echo [5/5] Installing dependencies...
pip install -r requirements.txt
echo.

REM Copy .env file
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file...
        copy .env.example .env
        echo .env file created. You can edit it if needed.
    )
)
echo.

REM Start server
echo ============================================
echo   Starting TaskPro Backend Server...
echo ============================================
echo.
echo Backend will start on: http://localhost:5000
echo.
echo IMPORTANT: Keep this window open while using TaskPro
echo.
echo In another terminal, navigate to:
echo   TaskPro\frontend
echo And run:
echo   python -m http.server 8000
echo.
echo Then open: http://localhost:8000/templates/auth.html
echo.
echo ============================================
echo.

python run.py

pause

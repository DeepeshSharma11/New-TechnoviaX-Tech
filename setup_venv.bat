@echo off
echo Setting up Python Virtual Environment...

REM Check Python
python --version
if errorlevel 1 (
    echo Python is not installed! Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Install virtualenv
pip install virtualenv

REM Create virtual environment
python -m venv venv

REM Activate
call venv\Scripts\activate.bat

REM Install dependencies
pip install fastapi uvicorn python-multipart firebase-admin pydantic

echo.
echo ============================================
echo Virtual Environment Setup Complete!
echo ============================================
echo.
echo To activate: venv\Scripts\activate
echo To deactivate: deactivate
echo.
pause
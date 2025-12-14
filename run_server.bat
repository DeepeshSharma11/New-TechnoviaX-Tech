



@echo off
echo Starting TechnoviaX Backend Server...
echo.

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo Virtual environment not found!
    echo Run setup_venv.bat first
    pause
    exit /b 1
)

REM Activate venv
call venv\Scripts\activate.bat

REM Check if server.py exists
if not exist "backend\server.py" (
    echo Server file not found at backend\server.py
    pause
    exit /b 1
)

REM Start server
echo Server starting at http://localhost:5000
echo Press Ctrl+C to stop
echo.
python backend\server.py

pause
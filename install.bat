@echo off
echo ======================================
echo   NoteX Installation Script
echo ======================================
echo.

echo [1/4] Installing Backend Dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [3/4] Checking MongoDB status...
net start MongoDB >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB manually before running the application.
) else (
    echo MongoDB is running!
)
echo.

echo [4/4] Setup Complete!
echo.
echo ======================================
echo   Installation Successful!
echo ======================================
echo.
echo To start the application:
echo   1. Start backend:  cd server ^&^& npm start
echo   2. Start frontend: cd frontend ^&^& npm run dev
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause

@echo off
echo ========================================
echo Crypto Bros Platform - Setup & Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    echo.
) else (
    echo [1/3] Dependencies already installed
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo [2/3] Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env and add your API keys!
    echo.
) else (
    echo [2/3] Environment file already exists
    echo.
)

echo [3/3] Starting development servers...
echo.
echo This will start:
echo   - Frontend: http://localhost:5173
echo   - API:      http://localhost:3000
echo   - Docs:     http://localhost:3001/docs/
echo.
echo Press Ctrl+C to stop all servers
echo.

call npm run dev

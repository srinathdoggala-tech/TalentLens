@echo off
echo ===================================================
echo Starting TalentLens AI Platform...
echo ===================================================

:: Get the current directory of the batch file
set PROJECT_DIR=%~dp0
:: Remove trailing backslash if present
if "%PROJECT_DIR:~-1%"=="\" set PROJECT_DIR=%PROJECT_DIR:~0,-1%

:: Start backend in a new window
echo Starting FastAPI Backend on port 8000...
start "TalentLens Backend" /d "%PROJECT_DIR%" cmd /k "backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

:: Start frontend in a new window
echo Starting Next.js Frontend on port 8080...
start "TalentLens Frontend" /d "%PROJECT_DIR%\frontend" cmd /k "npm run dev"

echo ===================================================
echo Both servers have been spawned in new windows!
echo Frontend: http://localhost:8080
echo Backend: http://127.0.0.1:8000
echo ===================================================
pause

@echo off
echo ===================================================
echo Starting TalentLens AI Platform...
echo ===================================================

:: Start backend in a new window
echo Starting FastAPI Backend on port 8000...
start "TalentLens Backend" cmd /k ".\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

:: Start frontend in a new window
echo Starting Next.js Frontend on port 8080...
start "TalentLens Frontend" cmd /k "cd frontend && npm run dev"

echo ===================================================
echo Both servers have been spawned in new windows!
echo Frontend: http://localhost:8080
echo Backend: http://127.0.0.1:8000
echo ===================================================
pause

@echo off
setlocal
cd /d "%~dp0"
echo ========================================
echo BREAKPOINT - FULL STACK STARTUP
echo ========================================
where python >nul 2>nul || (echo Python is required. Install Python 3.11+ and retry.&pause&exit /b 1)
where node >nul 2>nul || (echo Node.js is required. Install Node.js 18+ and retry.&pause&exit /b 1)
if not exist "backend\.venv\Scripts\python.exe" (
  echo Creating backend virtual environment...
  python -m venv backend\.venv
)
echo Installing backend dependencies...
backend\.venv\Scripts\python.exe -m pip install -q -r backend\requirements.txt
if not exist "frontend\node_modules" (
  echo Installing frontend dependencies...
  cd frontend
  call npm install
  cd ..
)
echo Starting backend on http://127.0.0.1:8000 ...
start "BREAKPOINT Backend" cmd /k "cd /d "%~dp0backend" && ..\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
timeout /t 2 /nobreak >nul
echo Starting frontend on http://127.0.0.1:5173 ...
start "BREAKPOINT Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 0.0.0.0 --port 5173"
timeout /t 3 /nobreak >nul
start "" http://127.0.0.1:5173/
echo.
echo BREAKPOINT is starting. Keep both terminal windows open.
endlocal

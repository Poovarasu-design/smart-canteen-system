@echo off
title Smart Canteen Pre-Ordering System
echo ========================================================
echo   Starting Smart Canteen System (Frontend + Backend)
echo ========================================================
echo.
cd /d "%~dp0"

echo 1. Starting Backend Express Server on port 5000...
start "Smart Canteen - Backend API (Port 5000)" cmd /k "cd server && npm start"

echo 2. Starting Frontend Client on port 5173...
start "Smart Canteen - Frontend UI (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo   System Started Successfully!
echo   Open your browser at:
echo   --^> http://localhost:5173
echo   --^> or http://localhost:5000
echo ========================================================
echo.
pause

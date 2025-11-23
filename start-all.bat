@echo off
echo Starting Unified Employee System...
echo.

REM Seed the database
echo Seeding admin user...
cd backend
node scripts/seedAdmin.js
cd ..

REM Start Backend
echo Starting Backend...
start "Backend" cmd /k "cd backend && npm start"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

REM Wait a bit
timeout /t 3 /nobreak >nul

REM Start .NET Service
echo Starting .NET Service...
start ".NET Service" cmd /k "cd dotnet_service && dotnet run"

echo.
echo ========================================
echo All services are starting!
echo ========================================
echo.
echo Services:
echo   Frontend:     http://localhost:5173
echo   Backend:      http://localhost:5000
echo   .NET Service: http://localhost:5192
echo.
echo Admin Credentials:
echo   Email:    admin@g.com
echo   Password: admin
echo.
echo Close the terminal windows to stop services.
pause

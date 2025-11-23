# Unified Employee System - Start All Services
Write-Host "Starting Unified Employee System..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "`nChecking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    exit 1
}
Write-Host "MongoDB is running." -ForegroundColor Green

# Seed the database
Write-Host "`nSeeding admin user..." -ForegroundColor Yellow
Set-Location backend
node scripts/seedAdmin.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Seed script failed. Continuing anyway..." -ForegroundColor Yellow
}
Set-Location ..

# Start Backend
Write-Host "`nStarting Backend (Node.js)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

# Wait a bit for frontend to start
Start-Sleep -Seconds 3

# Start .NET Service
Write-Host "Starting .NET Service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\dotnet_service'; dotnet run"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "All services are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nServices:" -ForegroundColor Cyan
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:      http://localhost:5000" -ForegroundColor White
Write-Host "  .NET Service: http://localhost:5192" -ForegroundColor White
Write-Host "`nAdmin Credentials:" -ForegroundColor Cyan
Write-Host "  Email:    admin@g.com" -ForegroundColor White
Write-Host "  Password: admin" -ForegroundColor White
Write-Host "`nPress Ctrl+C in each terminal window to stop services." -ForegroundColor Yellow

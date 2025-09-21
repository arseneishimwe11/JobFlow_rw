# JobFlow Start Script
# Starts both backend and frontend servers

Write-Host "🚀 Starting JobFlow Application..." -ForegroundColor Cyan

# Function to start backend in background
function Start-Backend {
    Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal
}

# Function to start frontend in background  
function Start-Frontend {
    Write-Host "🎨 Starting frontend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal
}

# Check if backend dependencies are installed
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "❌ Backend dependencies not found. Please run setup.ps1 first" -ForegroundColor Red
    exit 1
}

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "❌ Frontend dependencies not found. Please run setup.ps1 first" -ForegroundColor Red
    exit 1
}

# Start both servers
Start-Backend
Start-Sleep -Seconds 2
Start-Frontend

Write-Host "`n✅ Both servers are starting..." -ForegroundColor Green
Write-Host "`n🌐 Access points:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host "   API Documentation: http://localhost:4000/api/docs" -ForegroundColor Cyan

Write-Host "`n👤 Admin Login:" -ForegroundColor Yellow
Write-Host "   Email: admin@akazi.rw" -ForegroundColor Cyan
Write-Host "   Password: admin123" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

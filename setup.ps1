# JobFlow Setup Script for Windows PowerShell
# This script sets up the complete JobFlow application

Write-Host "🚀 JobFlow Setup Script" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install npm" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "psql")) {
    Write-Host "⚠️  PostgreSQL client (psql) not found. Make sure PostgreSQL is installed and in PATH" -ForegroundColor Yellow
}

Write-Host "✅ Prerequisites check completed" -ForegroundColor Green

# Install root dependencies
Write-Host "`n📦 Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# Return to root
Set-Location ..

# Database setup
Write-Host "`n🗄️  Setting up database..." -ForegroundColor Yellow
Set-Location backend

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Please create it from .env.example and configure your database URL" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Created .env file from .env.example. Please edit it with your database credentials." -ForegroundColor Yellow
    Write-Host "   Example: DATABASE_URL='postgresql://postgres:password@localhost:5432/jobflow_db'" -ForegroundColor Cyan
    
    # Pause for user to configure
    Write-Host "`nPress Enter after you've configured the .env file..." -ForegroundColor Yellow
    Read-Host
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host "🔧 Pushing database schema..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema. Please check your DATABASE_URL in .env" -ForegroundColor Red
    Write-Host "   Make sure PostgreSQL is running and the database exists" -ForegroundColor Yellow
    exit 1
}

# Seed database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to seed database" -ForegroundColor Red
    exit 1
}

# Return to root
Set-Location ..

Write-Host "`n✅ Setup completed successfully!" -ForegroundColor Green
Write-Host "`n🎉 JobFlow is ready to run!" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

Write-Host "`n📚 Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "`n2. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend && npm run dev" -ForegroundColor Cyan

Write-Host "`n🌐 Access points:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host "   API Documentation: http://localhost:4000/api/docs" -ForegroundColor Cyan
Write-Host "   Health Check: http://localhost:4000/health" -ForegroundColor Cyan

Write-Host "`n👤 Admin Login:" -ForegroundColor Yellow
Write-Host "   Email: admin@akazi.rw" -ForegroundColor Cyan
Write-Host "   Password: admin123" -ForegroundColor Cyan

Write-Host "`n🔧 Useful commands:" -ForegroundColor Yellow
Write-Host "   Backend dev: cd backend && npm run dev" -ForegroundColor Cyan
Write-Host "   Frontend dev: cd frontend && npm run dev" -ForegroundColor Cyan
Write-Host "   Database reset: cd backend && npm run db:push && npm run db:seed" -ForegroundColor Cyan

Write-Host "`nHappy coding! 🚀" -ForegroundColor Green

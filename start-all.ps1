# Start All Services Script for Proximus-Inspired Telecom Application
# This script starts all backend services and the UI in separate PowerShell windows

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Proximus-Inspired Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "OK .env file created" -ForegroundColor Green
}

# Load environment variables from .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "OK Environment variables loaded" -ForegroundColor Green
}

# Set Spring profile for local development
$env:SPRING_PROFILES_ACTIVE = "dev"

Write-Host ""
Write-Host "Building all services..." -ForegroundColor Yellow
mvn clean install -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "OK Build completed successfully" -ForegroundColor Green
Write-Host ""

# Function to start a service in a new window
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Module,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Cyan
    
    $escapedDir = $SCRIPT_DIR.Replace("'", "''")
    $command = @"
cd '$escapedDir'
`$host.UI.RawUI.WindowTitle = '$ServiceName'
Write-Host 'Starting $ServiceName...' -ForegroundColor Green
mvn -pl $Module spring-boot:run
Read-Host 'Press Enter to close'
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    
    Start-Sleep -Seconds 2
    Write-Host "OK $ServiceName started" -ForegroundColor Green
}

# Start all services
Write-Host "Starting backend services..." -ForegroundColor Yellow
Write-Host ""

Start-Service -ServiceName "Auth Service" -Module "auth-service" -Port 8081
Start-Service -ServiceName "Product Service" -Module "product-service" -Port 8082
Start-Service -ServiceName "Order Service" -Module "order-service" -Port 8083
Start-Service -ServiceName "Billing Service" -Module "billing-service" -Port 8084
Start-Service -ServiceName "Gateway" -Module "gateway" -Port 8080

Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start UI
Write-Host "Starting UI..." -ForegroundColor Cyan
$escapedDir = $SCRIPT_DIR.Replace("'", "''")
$uiCommand = @"
cd '$escapedDir\ui'
`$host.UI.RawUI.WindowTitle = 'UI (Next.js)'
Write-Host 'Installing dependencies...' -ForegroundColor Green
npm install
Write-Host 'Starting Next.js dev server...' -ForegroundColor Green
npm run dev
Read-Host 'Press Enter to close'
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $uiCommand
Write-Host "OK UI started" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services running on:" -ForegroundColor Cyan
Write-Host "  Gateway:          http://localhost:8080" -ForegroundColor White
Write-Host "  UI:               http://localhost:3000" -ForegroundColor White
Write-Host "  Auth Service:     http://localhost:8081" -ForegroundColor Gray
Write-Host "  Product Service:  http://localhost:8082" -ForegroundColor Gray
Write-Host "  Order Service:    http://localhost:8083" -ForegroundColor Gray
Write-Host "  Billing Service:  http://localhost:8084" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop all services, close all PowerShell windows or run:" -ForegroundColor Yellow
Write-Host "  .\stop-all.ps1" -ForegroundColor White
Write-Host ""

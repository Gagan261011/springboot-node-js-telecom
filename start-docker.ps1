#!/usr/bin/env pwsh
# Start Application Stack using Docker Compose
# This is the recommended way to run the full application

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Application with Docker Compose" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
}

# Stop any existing containers
Write-Host "Stopping any existing containers..." -ForegroundColor Yellow
docker compose down 2>&1 | Out-Null
Write-Host "✓ Existing containers stopped" -ForegroundColor Green
Write-Host ""

# Build and start all services
Write-Host "Building and starting all services..." -ForegroundColor Yellow
Write-Host "(This may take several minutes on first run)" -ForegroundColor Gray
Write-Host ""

docker compose up --build

# Note: The above command runs in foreground. To run in background, use:
# docker compose up --build -d

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Application stopped" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

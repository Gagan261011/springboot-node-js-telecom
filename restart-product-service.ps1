# Restart Product Service
# This script stops the product service and restarts it

$ErrorActionPreference = "Continue"

Write-Host "Restarting Product Service..." -ForegroundColor Cyan

# Stop the product service
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*product-service*"
}

if ($javaProcesses) {
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping Product Service (PID: $($_.Id))" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start the service
Write-Host "Starting Product Service..." -ForegroundColor Green
$command = @"
cd '$SCRIPT_DIR'
`$host.UI.RawUI.WindowTitle = 'Product Service'
Write-Host 'Starting Product Service...' -ForegroundColor Green
mvn -pl product-service spring-boot:run
Read-Host 'Press Enter to close'
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

Write-Host "OK Product Service restarted" -ForegroundColor Green
Write-Host ""

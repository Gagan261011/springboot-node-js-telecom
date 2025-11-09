# Restart Gateway
# This script stops the gateway and restarts it

$ErrorActionPreference = "Continue"

Write-Host "Restarting Gateway..." -ForegroundColor Cyan

# Stop the gateway
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*gateway*"
}

if ($javaProcesses) {
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping Gateway (PID: $($_.Id))" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start the service
Write-Host "Starting Gateway..." -ForegroundColor Green
$command = @"
cd '$SCRIPT_DIR'
`$host.UI.RawUI.WindowTitle = 'Gateway'
Write-Host 'Starting Gateway...' -ForegroundColor Green
`$env:SPRING_PROFILES_ACTIVE='dev'
mvn -pl gateway spring-boot:run
Read-Host 'Press Enter to close'
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

Write-Host "OK Gateway restarted" -ForegroundColor Green
Write-Host ""

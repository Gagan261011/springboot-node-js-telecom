# Restart UI (Next.js)
# This script stops the UI and restarts it

$ErrorActionPreference = "Continue"

Write-Host "Restarting UI..." -ForegroundColor Cyan

# Stop the UI
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*next*"
}

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  Stopping UI (PID: $($_.Id))" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start the UI
Write-Host "Starting UI..." -ForegroundColor Green
$command = @"
cd '$SCRIPT_DIR\ui'
`$host.UI.RawUI.WindowTitle = 'UI (Next.js)'
Write-Host 'Starting Next.js dev server...' -ForegroundColor Green
npm run dev
Read-Host 'Press Enter to close'
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $command

Write-Host "OK UI restarted" -ForegroundColor Green
Write-Host ""
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

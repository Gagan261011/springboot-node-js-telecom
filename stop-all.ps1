#!/usr/bin/env pwsh
# Stop All Services Script for Proximus-Inspired Telecom Application
# This script stops all Java and Node.js processes related to the application

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Stopping Proximus-Inspired Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop all Maven/Java processes (Spring Boot services)
Write-Host "Stopping Spring Boot services..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*spring-boot*" -or 
    $_.CommandLine -like "*auth-service*" -or 
    $_.CommandLine -like "*product-service*" -or 
    $_.CommandLine -like "*order-service*" -or 
    $_.CommandLine -like "*billing-service*" -or 
    $_.CommandLine -like "*gateway*"
}

if ($javaProcesses) {
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Spring Boot services stopped" -ForegroundColor Green
} else {
    Write-Host "  No Spring Boot services running" -ForegroundColor Gray
}

Write-Host ""

# Stop Node.js processes (Next.js UI)
Write-Host "Stopping Next.js UI..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*next*" -or $_.CommandLine -like "*npm*"
}

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Next.js UI stopped" -ForegroundColor Green
} else {
    Write-Host "  No Next.js processes running" -ForegroundColor Gray
}

Write-Host ""

# Stop Maven processes
Write-Host "Stopping Maven processes..." -ForegroundColor Yellow
$mavenProcesses = Get-Process -Name "mvn" -ErrorAction SilentlyContinue

if ($mavenProcesses) {
    $mavenProcesses | ForEach-Object {
        Write-Host "  Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✓ Maven processes stopped" -ForegroundColor Green
} else {
    Write-Host "  No Maven processes running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services stopped" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

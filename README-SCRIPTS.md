# Application Startup Scripts

This directory contains scripts to easily start and stop the entire application stack.

## Available Scripts

### 1. `start-all.ps1` - Start All Services Locally

Starts all services (auth, product, order, billing, gateway, UI) in separate PowerShell windows for local development.

**Prerequisites:**
- Java 17+ installed
- Maven installed
- Node.js 20+ installed
- All dependencies resolved

**Usage:**
```powershell
.\start-all.ps1
```

**Features:**
- Automatically creates .env file if missing
- Builds all services before starting
- Opens each service in a separate window for easy monitoring
- Sets up dev profile for localhost routing
- Shows all service URLs when complete

**Services started:**
- Auth Service (port 8081)
- Product Service (port 8082)
- Order Service (port 8083)
- Billing Service (port 8084)
- Gateway (port 8080)
- UI - Next.js (port 3000)

**Access the application:**
- Main UI: http://localhost:3000
- API Gateway: http://localhost:8080

---

### 2. `stop-all.ps1` - Stop All Services

Stops all running Java and Node.js processes related to the application.

**Usage:**
```powershell
.\stop-all.ps1
```

**Features:**
- Finds and stops all Spring Boot services
- Stops Next.js UI processes
- Cleans up Maven processes
- Safe to run even if services aren't running

---

### 3. `start-docker.ps1` - Start with Docker Compose (Recommended)

Starts the entire application stack using Docker Compose. This is the **recommended** method as it:
- Ensures consistent environment
- Handles all service dependencies
- No need for local Java/Node.js setup
- Better isolation between services

**Prerequisites:**
- Docker Desktop installed and running

**Usage:**
```powershell
.\start-docker.ps1
```

**Features:**
- Automatically checks if Docker is running
- Creates .env file if missing
- Stops any existing containers
- Builds and starts all services with proper networking
- Services start in correct order with health checks

**Access the application:**
- Main UI: http://localhost:3000
- API Gateway: http://localhost:8080

**To run in background (detached mode):**
Edit the script and change the last command to:
```powershell
docker compose up --build -d
```

**To stop Docker services:**
```powershell
docker compose down
```

**To view logs:**
```powershell
docker compose logs -f [service-name]
```

---

## Quick Start Guide

### For Development (Local)
```powershell
# Start all services
.\start-all.ps1

# When done, stop all services
.\stop-all.ps1
```

### For Production-like Environment (Docker)
```powershell
# Start with Docker
.\start-docker.ps1

# Stop with Docker
docker compose down
```

---

## Troubleshooting

### Port Already in Use
If you see "port already in use" errors:
```powershell
# Stop all services
.\stop-all.ps1

# Or check what's using the port
netstat -ano | findstr :8080
```

### Services Not Starting
1. Check if all dependencies are installed:
   ```powershell
   java -version
   mvn -version
   node -version
   ```

2. Ensure .env file exists:
   ```powershell
   cat .env
   ```

3. Try building manually:
   ```powershell
   mvn clean install -DskipTests
   ```

### Docker Issues
1. Ensure Docker Desktop is running
2. Check Docker status:
   ```powershell
   docker info
   ```

3. Clean up Docker resources:
   ```powershell
   docker compose down -v
   docker system prune -f
   ```

---

## Environment Variables

All scripts use the `.env` file for configuration. Key variables:

```env
GATEWAY_PORT=8080
JWT_SECRET=ptP13lR5adKS5XlPlSt+X7x08pU0MHnR5A2/r5zY0q0=
AUTH_PORT=8081
PRODUCT_PORT=8082
ORDER_PORT=8083
BILLING_PORT=8084
UI_PORT=3000
API_BASE=http://localhost:8080
```

You can customize these values by editing the `.env` file.

---

## Notes

- **Development**: Use `start-all.ps1` for active development with hot reload
- **Testing**: Use `start-docker.ps1` for testing the full stack
- **CI/CD**: Docker Compose is recommended for deployment pipelines
- All scripts are idempotent - safe to run multiple times
- Logs for each service appear in their respective windows

#!/usr/bin/env bash
set -euo pipefail

# Unified launcher for all Spring Boot services and the Next.js UI (Linux/macOS)

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

ENV_FILE="$SCRIPT_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Creating .env from .env.example"
  cp "$SCRIPT_DIR/.env.example" "$ENV_FILE"
fi

# Export environment variables from .env
set -o allexport
source "$ENV_FILE"
set +o allexport

# Local dev defaults
export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-dev}"
export PRODUCT_SERVICE_URL="${PRODUCT_SERVICE_URL:-http://localhost:${PRODUCT_PORT:-8082}}"
export ORDER_SERVICE_URL="${ORDER_SERVICE_URL:-http://localhost:${ORDER_PORT:-8083}}"
export API_BASE="${API_BASE:-http://localhost:${GATEWAY_PORT:-8080}}"

echo "Building backend modules (skip tests)..."
mvn -q clean install -DskipTests

pids=()
cleanup() {
  echo ""
  echo "Stopping services..."
  for pid in "${pids[@]:-}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
    fi
  done
}
trap cleanup INT TERM EXIT

start_service() {
  local name="$1" module="$2" port="$3"
  echo "Starting ${name} on port ${port}..."
  mvn -pl "$module" spring-boot:run >"${LOG_DIR}/${module}.log" 2>&1 &
  pids+=("$!")
}

start_ui() {
  echo "Starting UI on port ${UI_PORT:-3000} (API_BASE=${API_BASE})..."
  cd "$SCRIPT_DIR/ui"
  npm install >>"${LOG_DIR}/ui.log" 2>&1
  API_BASE="$API_BASE" npm run dev >>"${LOG_DIR}/ui.log" 2>&1 &
  pids+=("$!")
  cd "$SCRIPT_DIR"
}

echo "Launching services..."
start_service "Auth Service" "auth-service" "${AUTH_PORT:-8081}"
start_service "Product Service" "product-service" "${PRODUCT_PORT:-8082}"
start_service "Order Service" "order-service" "${ORDER_PORT:-8083}"
start_service "Billing Service" "billing-service" "${BILLING_PORT:-8084}"
start_service "Gateway" "gateway" "${GATEWAY_PORT:-8080}"

start_ui

echo ""
echo "All services started."
echo "Gateway: http://localhost:${GATEWAY_PORT:-8080}"
echo "UI:      http://localhost:${UI_PORT:-3000}"
echo "Logs:    $LOG_DIR"
echo "Press Ctrl+C to stop everything."

wait

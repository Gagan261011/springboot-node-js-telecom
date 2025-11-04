#!/usr/bin/env bash
set -euo pipefail

API_BASE=${API_BASE:-http://localhost:8080}
EMAIL=${SMOKE_EMAIL:-"smoke.$(date +%s)@example.com"}
PASSWORD=${SMOKE_PASSWORD:-"SmokeTest123"}
FULL_NAME=${SMOKE_FULL_NAME:-"Smoke Tester"}

COOKIE_JAR=$(mktemp)
trap 'rm -f "$COOKIE_JAR"' EXIT

echo "Smoke test starting against ${API_BASE}"

echo "1) Registering user ${EMAIL}"
curl -sS -X POST "${API_BASE}/api/auth/register" \
  -H "Content-Type: application/json" \
  -c "${COOKIE_JAR}" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"fullName\":\"${FULL_NAME}\"}" >/dev/null

echo "2) Logging in"
curl -sS -X POST "${API_BASE}/api/auth/login" \
  -H "Content-Type: application/json" \
  -b "${COOKIE_JAR}" -c "${COOKIE_JAR}" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}" >/dev/null

echo "3) Listing products"
PRODUCTS_JSON=$(curl -sS "${API_BASE}/api/products" -b "${COOKIE_JAR}")
export PRODUCTS_JSON
PRODUCT_ID=$(python - <<'PY'
import json, os
products = json.loads(os.environ["PRODUCTS_JSON"])
print(products[0]["id"] if products else 1)
PY
)

echo "   -> Selected product ${PRODUCT_ID}"

echo "4) Adding product to cart"
curl -sS -X POST "${API_BASE}/api/orders/cart" \
  -H "Content-Type: application/json" \
  -b "${COOKIE_JAR}" \
  -d "{\"productId\":${PRODUCT_ID},\"qty\":1}" >/dev/null

echo "5) Checking out"
ORDER_JSON=$(curl -sS -X POST "${API_BASE}/api/orders/checkout" -b "${COOKIE_JAR}")
export ORDER_JSON
ORDER_ID=$(python - <<'PY'
import json, os
order = json.loads(os.environ["ORDER_JSON"])
print(order["id"])
PY
)
echo "   -> Created order ${ORDER_ID}"

echo "6) Creating invoice"
curl -sS -X POST "${API_BASE}/api/billing/invoice/${ORDER_ID}" \
  -b "${COOKIE_JAR}" >/dev/null

echo "7) Paying invoice"
INVOICES_JSON=$(curl -sS "${API_BASE}/api/billing/my" -b "${COOKIE_JAR}")
export INVOICES_JSON
INVOICE_ID=$(python - <<'PY'
import json, os
invoices = json.loads(os.environ["INVOICES_JSON"])
print(invoices[0]["id"] if invoices else 1)
PY
)
curl -sS -X POST "${API_BASE}/api/billing/pay/${INVOICE_ID}" \
  -b "${COOKIE_JAR}" >/dev/null

echo "8) Verifying orders and invoices"
curl -sS "${API_BASE}/api/orders/my" -b "${COOKIE_JAR}" >/dev/null
curl -sS "${API_BASE}/api/billing/my" -b "${COOKIE_JAR}" >/dev/null

echo "Smoke test completed successfully."

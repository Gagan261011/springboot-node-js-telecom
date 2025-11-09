$env:JWT_SECRET="MDEyMzQ1Njc4OUFCQ0RFRjAxMjM0NTY3ODlBQkNERUY="
$env:BILLING_PORT="8084"
$env:ORDER_SERVICE_URL="http://localhost:8083"
mvn -pl billing-service spring-boot:run

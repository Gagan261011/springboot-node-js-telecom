$env:JWT_SECRET="MDEyMzQ1Njc4OUFCQ0RFRjAxMjM0NTY3ODlBQkNERUY="
$env:ORDER_PORT="8083"
$env:PRODUCT_SERVICE_URL="http://localhost:8082"
mvn -pl order-service spring-boot:run

$env:JWT_SECRET="MDEyMzQ1Njc4OUFCQ0RFRjAxMjM0NTY3ODlBQkNERUY="
$env:PRODUCT_PORT="8082"
$env:PRODUCT_SEED_ON_STARTUP="true"
mvn -pl product-service spring-boot:run

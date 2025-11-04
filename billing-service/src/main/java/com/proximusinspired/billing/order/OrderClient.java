package com.proximusinspired.billing.order;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class OrderClient {

    private final RestClient restClient;

    public OrderClient(@Value("${order.service.url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public OrderSummary getOrder(Long orderId, String bearerToken) {
        try {
            return restClient.get()
                    .uri("/api/orders/{id}", orderId)
                    .header(HttpHeaders.AUTHORIZATION, bearerToken)
                    .retrieve()
                    .body(OrderSummary.class);
        } catch (RestClientResponseException ex) {
            throw new OrderNotAccessibleException("Order not accessible: " + ex.getStatusText(), ex);
        }
    }

    public record OrderSummary(Long id, java.math.BigDecimal total, String status) {
    }
}

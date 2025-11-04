package com.proximusinspired.order.api;

import com.proximusinspired.order.domain.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        BigDecimal total,
        OrderStatus status,
        Instant createdAt,
        List<OrderItemDto> items
) {
}

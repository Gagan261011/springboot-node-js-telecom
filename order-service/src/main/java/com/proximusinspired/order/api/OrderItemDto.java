package com.proximusinspired.order.api;

import java.math.BigDecimal;

public record OrderItemDto(Long productId, int quantity, BigDecimal price) {
}

package com.proximusinspired.order.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull Long productId,
        @Min(1) int qty
) {
}

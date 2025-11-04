package com.proximusinspired.product.api;

import com.proximusinspired.product.domain.ProductType;

import java.math.BigDecimal;
import java.util.List;

public record ProductDto(
        Long id,
        String sku,
        String name,
        ProductType type,
        String description,
        BigDecimal priceMonthly,
        List<String> features,
        boolean active
) {
}

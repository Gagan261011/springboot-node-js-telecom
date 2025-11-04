package com.proximusinspired.product.api;

import com.proximusinspired.product.domain.Product;

import java.util.List;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductDto toDto(Product product) {
        List<String> features = List.copyOf(product.getFeatures());
        return new ProductDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getType(),
                product.getDescription(),
                product.getPriceMonthly(),
                features,
                product.isActive()
        );
    }
}

package com.proximusinspired.product.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByType(ProductType type);
    boolean existsBySku(String sku);
}

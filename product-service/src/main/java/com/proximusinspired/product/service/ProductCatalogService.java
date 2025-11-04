package com.proximusinspired.product.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.proximusinspired.product.api.ProductDto;
import com.proximusinspired.product.api.ProductMapper;
import com.proximusinspired.product.domain.Product;
import com.proximusinspired.product.domain.ProductRepository;
import com.proximusinspired.product.domain.ProductType;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductCatalogService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;
    private final Resource seedResource;
    private final boolean seedOnStartup;

    public ProductCatalogService(ProductRepository productRepository,
                                 ObjectMapper objectMapper,
                                 @Value("classpath:seed-products.json") Resource seedResource,
                                 @Value("${app.seed.on-startup:true}") boolean seedOnStartup) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
        this.seedResource = seedResource;
        this.seedOnStartup = seedOnStartup;
    }

    @PostConstruct
    public void maybeSeed() {
        if (seedOnStartup && productRepository.count() == 0) {
            seedProducts();
        }
    }

    @Transactional(readOnly = true)
    public List<ProductDto> listProducts(Optional<ProductType> type) {
        List<Product> products = type.map(productRepository::findByType)
                .orElseGet(productRepository::findAll);
        return products.stream()
                .filter(Product::isActive)
                .map(ProductMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<ProductDto> findById(Long id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .map(ProductMapper::toDto);
    }

    @Transactional
    public List<ProductDto> seedProducts() {
        try (InputStream in = seedResource.getInputStream()) {
            List<Map<String, Object>> rawProducts = objectMapper.readValue(in, new TypeReference<>() {});
            if (rawProducts.isEmpty()) {
                return Collections.emptyList();
            }
            for (Map<String, Object> raw : rawProducts) {
                String sku = (String) raw.get("sku");
                if (sku == null || productRepository.existsBySku(sku)) {
                    continue;
                }
                Product product = new Product();
                product.setSku(sku);
                product.setName((String) raw.get("name"));
                product.setType(ProductType.valueOf(((String) raw.get("type")).toUpperCase()));
                product.setDescription((String) raw.get("description"));
                Object priceObj = raw.get("priceMonthly");
                BigDecimal price = priceObj instanceof Number number
                        ? BigDecimal.valueOf(number.doubleValue())
                        : new BigDecimal(priceObj.toString());
                product.setPriceMonthly(price);
                @SuppressWarnings("unchecked")
                List<String> features = (List<String>) raw.getOrDefault("features", List.of());
                product.setFeatures(features);
                product.setActive(Boolean.parseBoolean(String.valueOf(raw.getOrDefault("active", true))));
                productRepository.save(product);
            }
            return listProducts(Optional.empty());
        } catch (IOException e) {
            throw new ProductServiceException("Failed to seed products", e);
        }
    }
}

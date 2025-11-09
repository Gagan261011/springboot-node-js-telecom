package com.proximusinspired.product.api;

import com.proximusinspired.product.domain.ProductType;
import com.proximusinspired.product.service.ProductCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductCatalogService productCatalogService;

    public ProductController(ProductCatalogService productCatalogService) {
        this.productCatalogService = productCatalogService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> list(@RequestParam Optional<ProductType> type) {
        return ResponseEntity.ok(productCatalogService.listProducts(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> byId(@PathVariable Long id) {
        return productCatalogService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/seed")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductDto>> seed() {
        return ResponseEntity.ok(productCatalogService.seedProducts());
    }
}

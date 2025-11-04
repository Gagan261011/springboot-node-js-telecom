package com.proximusinspired.product.service;

import com.proximusinspired.product.api.ProductDto;
import com.proximusinspired.product.domain.ProductRepository;
import com.proximusinspired.product.domain.ProductType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductCatalogServiceTests {

    @Autowired
    private ProductCatalogService productCatalogService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void seedsProductsOnStartup() {
        List<ProductDto> products = productCatalogService.listProducts(java.util.Optional.empty());
        assertThat(products).isNotEmpty();
    }

    @Test
    void filtersProductsByType() {
        List<ProductDto> mobile = productCatalogService.listProducts(java.util.Optional.of(ProductType.MOBILE));
        assertThat(mobile).allSatisfy(product -> assertThat(product.type()).isEqualTo(ProductType.MOBILE));
    }

    @Test
    void findByIdReturnsProduct() {
        ProductDto first = productCatalogService.listProducts(java.util.Optional.empty()).get(0);
        assertThat(productCatalogService.findById(first.id())).isPresent();
    }

    @Test
    void seedProductsDoesNotDuplicateExistingSkus() {
        long initialCount = productRepository.count();
        productCatalogService.seedProducts();
        assertThat(productRepository.count()).isEqualTo(initialCount);
    }

    @Test
    void productsAreActiveByDefault() {
        assertThat(productCatalogService.listProducts(java.util.Optional.empty()))
                .allMatch(ProductDto::active);
    }
}

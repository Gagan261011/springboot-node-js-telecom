package com.proximusinspired.order.service;

import com.proximusinspired.order.api.CartItemRequest;
import com.proximusinspired.order.api.CartItemResponse;
import com.proximusinspired.order.product.ProductClient;
import com.proximusinspired.order.product.ProductClient.ProductSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.annotation.DirtiesContext;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class OrderManagementServiceTests {

    @Autowired
    private OrderManagementService orderManagementService;

    @MockBean
    private ProductClient productClient;

    @BeforeEach
    void setupClient() {
        when(productClient.getProduct(anyLong()))
                .thenAnswer(invocation -> new ProductSummary(invocation.getArgument(0), BigDecimal.valueOf(10), true));
    }

    @Test
    void addToCartCreatesNewItem() {
        CartItemResponse response = orderManagementService.addToCart(1L, new CartItemRequest(100L, 2));
        assertThat(response.quantity()).isEqualTo(2);
    }

    @Test
    void addToCartIncrementsExistingItem() {
        orderManagementService.addToCart(1L, new CartItemRequest(100L, 1));
        CartItemResponse response = orderManagementService.addToCart(1L, new CartItemRequest(100L, 2));
        assertThat(response.quantity()).isEqualTo(3);
    }

    @Test
    void checkoutCreatesOrderAndClearsCart() {
        orderManagementService.addToCart(1L, new CartItemRequest(100L, 2));
        var order = orderManagementService.checkout(1L);
        assertThat(order.total()).isEqualByComparingTo(BigDecimal.valueOf(20));
        assertThat(orderManagementService.getCart(1L)).isEmpty();
    }

    @Test
    void checkoutThrowsWhenCartEmpty() {
        assertThatThrownBy(() -> orderManagementService.checkout(1L))
                .isInstanceOf(OrderServiceException.class);
    }

    @Test
    void removeFromCartDeletesItem() {
        CartItemResponse response = orderManagementService.addToCart(1L, new CartItemRequest(100L, 1));
        orderManagementService.removeFromCart(1L, response.id());
        assertThat(orderManagementService.getCart(1L)).isEmpty();
    }
}

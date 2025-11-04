package com.proximusinspired.order.api;

import com.proximusinspired.order.security.JwtPrincipal;
import com.proximusinspired.order.service.OrderManagementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderManagementService orderManagementService;

    public OrderController(OrderManagementService orderManagementService) {
        this.orderManagementService = orderManagementService;
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItemResponse>> cart(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(orderManagementService.getCart(principal.userId()));
    }

    @PostMapping("/cart")
    public ResponseEntity<CartItemResponse> addToCart(@AuthenticationPrincipal JwtPrincipal principal,
                                                      @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(orderManagementService.addToCart(principal.userId(), request));
    }

    @DeleteMapping("/cart/{id}")
    public ResponseEntity<Void> removeFromCart(@AuthenticationPrincipal JwtPrincipal principal,
                                               @PathVariable Long id) {
        orderManagementService.removeFromCart(principal.userId(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(orderManagementService.checkout(principal.userId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> myOrders(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(orderManagementService.myOrders(principal.userId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@AuthenticationPrincipal JwtPrincipal principal,
                                                  @PathVariable Long id) {
        return orderManagementService.getOrder(principal.userId(), id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

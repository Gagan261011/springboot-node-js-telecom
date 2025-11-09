package com.proximusinspired.order.service;

import com.proximusinspired.order.api.CartItemRequest;
import com.proximusinspired.order.api.CartItemResponse;
import com.proximusinspired.order.api.OrderMapper;
import com.proximusinspired.order.api.OrderResponse;
import com.proximusinspired.order.domain.CartItem;
import com.proximusinspired.order.domain.CartItemRepository;
import com.proximusinspired.order.domain.CustomerOrder;
import com.proximusinspired.order.domain.CustomerOrderRepository;
import com.proximusinspired.order.domain.OrderItem;
import com.proximusinspired.order.product.ProductClient;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderManagementService {

    private final CartItemRepository cartItemRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final ProductClient productClient;

    public OrderManagementService(CartItemRepository cartItemRepository,
                                  CustomerOrderRepository customerOrderRepository,
                                  ProductClient productClient) {
        this.cartItemRepository = cartItemRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.productClient = productClient;
    }

    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        var product = productClient.getProduct(request.productId());
        if (!product.active()) {
            throw new OrderServiceException("Product is not active");
        }
        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(userId, request.productId())
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setUserId(userId);
                    item.setProductId(request.productId());
                    item.setQuantity(0);
                    return item;
                });
        cartItem.setQuantity(cartItem.getQuantity() + request.qty());
        CartItem saved = cartItemRepository.save(cartItem);
        return new CartItemResponse(saved.getId(), saved.getProductId(), saved.getQuantity());
    }

    @Transactional
    public void removeFromCart(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .filter(ci -> ci.getUserId().equals(userId))
                .orElseThrow(() -> new OrderServiceException("Cart item not found"));
        cartItemRepository.delete(item);
    }

    @Transactional
    public OrderResponse checkout(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        if (items.isEmpty()) {
            throw new OrderServiceException("Cart is empty");
        }

        CustomerOrder order = new CustomerOrder();
        order.setUserId(userId);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            var product = productClient.getProduct(item.getProductId());
            if (!product.active()) {
                throw new OrderServiceException("Cart contains inactive product " + product.id());
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(item.getProductId());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.priceMonthly());
            order.getItems().add(orderItem);
            total = total.add(product.priceMonthly().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setTotal(total);
        CustomerOrder saved = customerOrderRepository.save(order);
        cartItemRepository.deleteByUserId(userId);
        return OrderMapper.toResponse(saved);
    }

    @Transactional
    public List<CartItemResponse> getCart(Long userId) {
        return cartItemRepository.findByUserId(userId).stream()
                .map(item -> new CartItemResponse(item.getId(), item.getProductId(), item.getQuantity()))
                .toList();
    }

    @Transactional
    public List<OrderResponse> myOrders(Long userId) {
        return customerOrderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Transactional
    public Optional<OrderResponse> getOrder(Long userId, Long orderId) {
        return customerOrderRepository.findById(orderId)
                .filter(order -> order.getUserId().equals(userId))
                .map(OrderMapper::toResponse);
    }
}

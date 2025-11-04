package com.proximusinspired.order.api;

import com.proximusinspired.order.domain.CustomerOrder;
import com.proximusinspired.order.domain.OrderItem;

import java.util.List;

public final class OrderMapper {

    private OrderMapper() {
    }

    public static OrderResponse toResponse(CustomerOrder order) {
        List<OrderItemDto> items = order.getItems().stream()
                .map(OrderMapper::toDto)
                .toList();
        return new OrderResponse(order.getId(), order.getTotal(), order.getStatus(), order.getCreatedAt(), items);
    }

    private static OrderItemDto toDto(OrderItem item) {
        return new OrderItemDto(item.getProductId(), item.getQuantity(), item.getPrice());
    }
}

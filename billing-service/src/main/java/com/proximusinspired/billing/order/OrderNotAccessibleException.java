package com.proximusinspired.billing.order;

public class OrderNotAccessibleException extends RuntimeException {
    public OrderNotAccessibleException(String message, Throwable cause) {
        super(message, cause);
    }
}

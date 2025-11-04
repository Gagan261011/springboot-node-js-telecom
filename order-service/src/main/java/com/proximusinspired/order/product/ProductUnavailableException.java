package com.proximusinspired.order.product;

public class ProductUnavailableException extends RuntimeException {
    public ProductUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}

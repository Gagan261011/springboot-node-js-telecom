package com.proximusinspired.product.security;

public record JwtPrincipal(Long userId, String email) {
}

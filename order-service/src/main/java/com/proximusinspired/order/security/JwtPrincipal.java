package com.proximusinspired.order.security;

public record JwtPrincipal(Long userId, String email) {
}

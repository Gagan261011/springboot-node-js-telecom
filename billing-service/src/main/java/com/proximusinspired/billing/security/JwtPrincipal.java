package com.proximusinspired.billing.security;

public record JwtPrincipal(Long userId, String email) {
}

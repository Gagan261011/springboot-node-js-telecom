package com.proximusinspired.auth.api;

public record AuthResponse(String accessToken, UserDto user) {
}

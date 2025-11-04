package com.proximusinspired.auth.service;

import com.proximusinspired.auth.api.AuthResponse;
import com.proximusinspired.auth.api.LoginRequest;
import com.proximusinspired.auth.api.RegisterRequest;
import com.proximusinspired.auth.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthServiceIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        request = new RegisterRequest("testuser@example.com", "Password123", "Test User");
    }

    @Test
    void registerCreatesUserAndReturnsToken() {
        AuthResponse response = authService.register(request);
        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("testuser@example.com");
        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void registerRejectsDuplicateEmail() {
        authService.register(request);
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(AuthServiceException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    void loginReturnsTokenForValidCredentials() {
        authService.register(request);
        AuthResponse response = authService.login(new LoginRequest("testuser@example.com", "Password123"));
        assertThat(response.accessToken()).isNotBlank();
    }

    @Test
    void loginFailsForInvalidPassword() {
        authService.register(request);
        assertThatThrownBy(() -> authService.login(new LoginRequest("testuser@example.com", "WrongPass1")))
                .isInstanceOf(AuthServiceException.class)
                .hasMessageContaining("Invalid credentials");
    }

    @Test
    void passwordIsStoredAsHash() {
        AuthResponse response = authService.register(request);
        var user = userRepository.findById(response.user().id()).orElseThrow();
        assertThat(user.getPasswordHash()).isNotEqualTo(request.password());
        assertThat(passwordEncoder.matches(request.password(), user.getPasswordHash())).isTrue();
    }
}

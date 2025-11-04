package com.proximusinspired.auth.api;

import com.proximusinspired.auth.service.AuthService;
import com.proximusinspired.auth.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return withCookie(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return withCookie(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .sameSite("Lax")
                .maxAge(0)
                .path("/")
                .build();
        return ResponseEntity.noContent()
                .header("Set-Cookie", cookie.toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(new UserDto(user.getId(), user.getEmail(), user.getFullName()));
    }

    private ResponseEntity<AuthResponse> withCookie(AuthResponse response) {
        ResponseCookie cookie = ResponseCookie.from("accessToken", response.accessToken())
                .httpOnly(true)
                .sameSite("Lax")
                .path("/")
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }
}

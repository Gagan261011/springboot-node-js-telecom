package com.proximusinspired.auth.service;

import com.proximusinspired.auth.api.AuthResponse;
import com.proximusinspired.auth.api.LoginRequest;
import com.proximusinspired.auth.api.RegisterRequest;
import com.proximusinspired.auth.api.UserDto;
import com.proximusinspired.auth.security.JwtService;
import com.proximusinspired.auth.user.User;
import com.proximusinspired.auth.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new AuthServiceException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setFullName(request.fullName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token, new UserDto(saved.getId(), saved.getEmail(), saved.getFullName()));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new AuthServiceException("Invalid credentials"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AuthServiceException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, new UserDto(user.getId(), user.getEmail(), user.getFullName()));
    }

    @Transactional(readOnly = true)
    public Optional<UserDto> me(Long userId) {
        return userRepository.findById(userId)
                .map(user -> new UserDto(user.getId(), user.getEmail(), user.getFullName()));
    }
}

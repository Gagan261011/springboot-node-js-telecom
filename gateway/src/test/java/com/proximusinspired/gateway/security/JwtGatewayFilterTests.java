package com.proximusinspired.gateway.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import reactor.core.publisher.Mono;

import static org.assertj.core.api.Assertions.assertThat;

class JwtGatewayFilterTests {

    private JwtService jwtService;
    private JwtGatewayFilter filter;

    @BeforeEach
    void setup() {
        jwtService = new JwtService("Y2hhbmdlLW1lLWRldi1vbmx5LXNlY3JldC1rZXktMzItYnl0ZXMta2V5", 3600);
        filter = new JwtGatewayFilter(jwtService);
    }

    @Test
    void allowsPublicPathWithoutToken() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/auth/login"));
        CapturingChain chain = new CapturingChain();
        filter.filter(exchange, chain).block();
        assertThat(chain.called).isTrue();
    }

    @Test
    void rejectsMissingTokenForProtectedPath() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders/cart"));
        CapturingChain chain = new CapturingChain();
        filter.filter(exchange, chain).block();
        assertThat(chain.called).isFalse();
        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void acceptsAuthorizationHeaderToken() {
        String token = jwtService.issueToken(5L, "user@example.com");
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders/cart")
                        .header("Authorization", "Bearer " + token));
        CapturingChain chain = new CapturingChain();
        filter.filter(exchange, chain).block();
        assertThat(chain.called).isTrue();
        assertThat(chain.mutatedRequest.getHeaders().getFirst("X-User-Id"))
                .isEqualTo("5");
    }

    @Test
    void acceptsCookieToken() {
        String token = jwtService.issueToken(7L, "cookie@example.com");
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders/cart")
                        .cookie(new org.springframework.http.HttpCookie("accessToken", token)));
        CapturingChain chain = new CapturingChain();
        filter.filter(exchange, chain).block();
        assertThat(chain.called).isTrue();
        assertThat(chain.mutatedRequest.getHeaders().getFirst("Authorization"))
                .contains(token);
    }

    @Test
    void rejectsInvalidToken() {
        MockServerWebExchange exchange = MockServerWebExchange.from(
                MockServerHttpRequest.get("/api/orders/cart")
                        .header("Authorization", "Bearer invalid"));
        CapturingChain chain = new CapturingChain();
        filter.filter(exchange, chain).block();
        assertThat(chain.called).isFalse();
        assertThat(exchange.getResponse().getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private static class CapturingChain implements GatewayFilterChain {
        boolean called = false;
        org.springframework.http.server.reactive.ServerHttpRequest mutatedRequest;

        @Override
        public Mono<Void> filter(org.springframework.web.server.ServerWebExchange exchange) {
            called = true;
            mutatedRequest = exchange.getRequest();
            return Mono.empty();
        }
    }
}

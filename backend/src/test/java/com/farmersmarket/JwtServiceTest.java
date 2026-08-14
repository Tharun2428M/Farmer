package com.farmersmarket;

import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService("my-very-strong-and-secure-test-jwt-secret-key-32-bytes-long", 3600000); // 1 hour
    }

    @Test
    @DisplayName("1. Generate and extract claims correctly from JWT")
    void testTokenGenerationAndClaims() {
        UUID userId = UUID.randomUUID();
        User user = new User("Ramesh Kumar", "ramesh@example.com", "hash", "9876543210", Role.FARMER);
        user.setId(userId);

        String token = jwtService.generateToken(user);
        assertThat(token).isNotNull();

        String username = jwtService.extractUsername(token);
        assertThat(username).isEqualTo("ramesh@example.com");

        UUID extractedUserId = jwtService.extractUserId(token);
        assertThat(extractedUserId).isEqualTo(userId);

        String role = jwtService.extractRole(token);
        assertThat(role).isEqualTo("FARMER");
    }

    @Test
    @DisplayName("2. Validate token against UserDetails")
    void testTokenValidation() {
        User user = new User("Test User", "test@example.com", "hash", "9876543210", Role.CUSTOMER);
        String token = jwtService.generateToken(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("hash")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
                .build();

        assertThat(jwtService.isTokenValid(token, userDetails)).isTrue();
    }

    @Test
    @DisplayName("3. Expired token is detected correctly")
    void testExpiredToken() {
        JwtService shortLivedJwtService = new JwtService(
                "my-very-strong-and-secure-test-jwt-secret-key-32-bytes-long",
                -1000 // Expired 1 second ago
        );

        User user = new User("Expired User", "expired@example.com", "hash", "9876543210", Role.CUSTOMER);
        String token = shortLivedJwtService.generateToken(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("expired@example.com")
                .password("hash")
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
                .build();

        assertThat(shortLivedJwtService.isTokenValid(token, userDetails)).isFalse();
    }
}

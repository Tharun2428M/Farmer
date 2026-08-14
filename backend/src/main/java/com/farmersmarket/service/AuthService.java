package com.farmersmarket.service;

import com.farmersmarket.dto.AuthResponse;
import com.farmersmarket.dto.LoginRequest;
import com.farmersmarket.dto.RegisterRequest;
import com.farmersmarket.dto.UserSummaryDto;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.AccountDisabledException;
import com.farmersmarket.exception.EmailAlreadyExistsException;
import com.farmersmarket.exception.ForbiddenRoleException;
import com.farmersmarket.exception.InvalidCredentialsException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String sanitizedEmail = request.getEmail().trim().toLowerCase();

        // 1. Role validation: Public registration for ADMIN is forbidden
        Role requestedRole = request.getRole() != null ? request.getRole() : Role.CUSTOMER;
        if (!Role.isPublicRegistrationAllowed(requestedRole)) {
            throw new ForbiddenRoleException("Public registration with role '" + requestedRole + "' is not permitted.");
        }

        // 2. Email uniqueness check
        if (userRepository.existsByEmail(sanitizedEmail)) {
            throw new EmailAlreadyExistsException("An account with email " + sanitizedEmail + " already exists.");
        }

        // 3. BCrypt password hashing
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 4. Create and save new user
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(sanitizedEmail);
        user.setPassword(hashedPassword);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setRole(requestedRole);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        // 5. Generate JWT token
        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(token, UserSummaryDto.fromEntity(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String sanitizedEmail = request.getEmail().trim().toLowerCase();

        // 1. Find user by email (use constant error message to prevent account enumeration)
        User user = userRepository.findByEmail(sanitizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        // 2. Verify account status
        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new AccountDisabledException("Your account is currently disabled or inactive. Please contact support.");
        }

        // 3. Verify BCrypt password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        // 4. Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(token, UserSummaryDto.fromEntity(user));
    }
}

package com.farmersmarket.controller;

import com.farmersmarket.dto.AdminUserDto;
import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final UserRepository userRepository;

    @Autowired
    public AdminUserController(AdminUserService adminUserService, UserRepository userRepository) {
        this.adminUserService = adminUserService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedAdmin(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated admin user not found."));
    }

    @GetMapping
    public ResponseEntity<PageResponse<AdminUserDto>> getUsers(
            @RequestParam(value = "role", required = false) Role role,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<AdminUserDto> users = adminUserService.getUsers(role, status, query, page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserDto> getUserById(@PathVariable("id") UUID id) {
        AdminUserDto user = adminUserService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdminUserDto> updateUserStatus(
            Authentication authentication,
            @PathVariable("id") UUID id,
            @Valid @RequestBody AdminUserStatusUpdateRequest request) {
        User admin = getAuthenticatedAdmin(authentication);
        AdminUserDto updated = adminUserService.updateUserStatus(id, request, admin);
        return ResponseEntity.ok(updated);
    }
}

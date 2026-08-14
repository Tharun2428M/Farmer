package com.farmersmarket.controller;

import com.farmersmarket.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Temporary authentication & RBAC verification controller (Phase 4).
 * These endpoints test role-based access restrictions for CUSTOMER, FARMER, and ADMIN roles.
 */
@RestController
@RequestMapping("/api")
public class TestAuthController {

    @GetMapping("/customer/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> customerTestEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> data = new HashMap<>();
        data.put("role", "CUSTOMER");
        data.put("authenticatedUser", authentication.getName());
        data.put("authorities", authentication.getAuthorities().toString());

        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Customer protected endpoint accessed successfully", data));
    }

    @GetMapping("/farmer/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> farmerTestEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> data = new HashMap<>();
        data.put("role", "FARMER");
        data.put("authenticatedUser", authentication.getName());
        data.put("authorities", authentication.getAuthorities().toString());

        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Farmer protected endpoint accessed successfully", data));
    }

    @GetMapping("/admin/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminTestEndpoint() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> data = new HashMap<>();
        data.put("role", "ADMIN");
        data.put("authenticatedUser", authentication.getName());
        data.put("authorities", authentication.getAuthorities().toString());

        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Admin protected endpoint accessed successfully", data));
    }
}

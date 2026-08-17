package com.farmersmarket.controller;

import com.farmersmarket.dto.SystemHealthDto;
import com.farmersmarket.service.AdminSystemHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSystemHealthController {

    private final AdminSystemHealthService adminSystemHealthService;

    @Autowired
    public AdminSystemHealthController(AdminSystemHealthService adminSystemHealthService) {
        this.adminSystemHealthService = adminSystemHealthService;
    }

    @GetMapping("/health")
    public ResponseEntity<SystemHealthDto> getSystemHealth() {
        SystemHealthDto health = adminSystemHealthService.getSystemHealth();
        return ResponseEntity.ok(health);
    }
}

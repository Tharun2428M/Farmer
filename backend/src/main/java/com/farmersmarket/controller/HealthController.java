package com.farmersmarket.controller;

import com.farmersmarket.service.DatabaseHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DatabaseHealthService databaseHealthService;

    @Autowired
    public HealthController(DatabaseHealthService databaseHealthService) {
        this.databaseHealthService = databaseHealthService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, Object> dbCheck = databaseHealthService.checkDatabaseConnection();
        boolean isConnected = Boolean.TRUE.equals(dbCheck.get("connected"));

        Map<String, String> response = new LinkedHashMap<>();
        if (isConnected) {
            response.put("status", "UP");
            response.put("database", "CONNECTED");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "DOWN");
            response.put("database", "DISCONNECTED");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}


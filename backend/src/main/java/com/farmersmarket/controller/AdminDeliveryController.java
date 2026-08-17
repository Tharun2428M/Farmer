package com.farmersmarket.controller;

import com.farmersmarket.dto.AdminDeliveryUpdateRequest;
import com.farmersmarket.dto.DeliveryResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.service.AdminDeliveryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/deliveries")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDeliveryController {

    private final AdminDeliveryService adminDeliveryService;

    @Autowired
    public AdminDeliveryController(AdminDeliveryService adminDeliveryService) {
        this.adminDeliveryService = adminDeliveryService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<DeliveryResponse>> getDeliveries(
            @RequestParam(value = "status", required = false) DeliveryStatus status,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<DeliveryResponse> deliveries = adminDeliveryService.getDeliveries(status, query, page, size);
        return ResponseEntity.ok(deliveries);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeliveryResponse> updateDelivery(
            @PathVariable("id") UUID id,
            @Valid @RequestBody AdminDeliveryUpdateRequest request) {
        DeliveryResponse updated = adminDeliveryService.updateDelivery(id, request);
        return ResponseEntity.ok(updated);
    }
}

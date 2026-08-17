package com.farmersmarket.controller;

import com.farmersmarket.dto.AdminFarmerDto;
import com.farmersmarket.dto.AdminProductDto;
import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.service.AdminFarmerService;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/farmers")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFarmerController {

    private final AdminFarmerService adminFarmerService;

    @Autowired
    public AdminFarmerController(AdminFarmerService adminFarmerService) {
        this.adminFarmerService = adminFarmerService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AdminFarmerDto>> getFarmers(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<AdminFarmerDto> farmers = adminFarmerService.getFarmers(query, page, size);
        return ResponseEntity.ok(farmers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminFarmerDto> getFarmerById(@PathVariable("id") UUID id) {
        AdminFarmerDto farmer = adminFarmerService.getFarmerById(id);
        return ResponseEntity.ok(farmer);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<AdminProductDto>> getFarmerProducts(@PathVariable("id") UUID id) {
        List<AdminProductDto> products = adminFarmerService.getFarmerProducts(id);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderResponse>> getFarmerOrders(@PathVariable("id") UUID id) {
        List<OrderResponse> orders = adminFarmerService.getFarmerOrders(id);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdminFarmerDto> updateFarmerStatus(
            @PathVariable("id") UUID id,
            @Valid @RequestBody AdminUserStatusUpdateRequest request) {
        AdminFarmerDto updated = adminFarmerService.updateFarmerStatus(id, request);
        return ResponseEntity.ok(updated);
    }
}

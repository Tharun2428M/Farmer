package com.farmersmarket.controller;

import com.farmersmarket.dto.AdminOrderStatusUpdateRequest;
import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @Autowired
    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<OrderResponse>> getOrders(
            @RequestParam(value = "status", required = false) OrderStatus status,
            @RequestParam(value = "paymentStatus", required = false) OrderPaymentStatus paymentStatus,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<OrderResponse> orders = adminOrderService.getOrders(status, paymentStatus, startDate, endDate, page, size);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable("id") UUID id) {
        OrderResponse order = adminOrderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable("id") UUID id,
            @Valid @RequestBody AdminOrderStatusUpdateRequest request) {
        OrderResponse updated = adminOrderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(updated);
    }
}

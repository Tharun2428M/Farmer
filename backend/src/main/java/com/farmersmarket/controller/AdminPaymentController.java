package com.farmersmarket.controller;

import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.PaymentResponse;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.service.AdminPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/payments")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    @Autowired
    public AdminPaymentController(AdminPaymentService adminPaymentService) {
        this.adminPaymentService = adminPaymentService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<PaymentResponse>> getPayments(
            @RequestParam(value = "status", required = false) PaymentStatus status,
            @RequestParam(value = "method", required = false) PaymentMethod method,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<PaymentResponse> payments = adminPaymentService.getPayments(status, method, query, page, size);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable("id") UUID id) {
        PaymentResponse payment = adminPaymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
}

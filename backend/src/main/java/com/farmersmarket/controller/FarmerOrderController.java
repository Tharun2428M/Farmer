package com.farmersmarket.controller;

import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.dto.UpdateOrderStatusRequest;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.FarmerOrderService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/farmer/orders")
@PreAuthorize("hasRole('FARMER')")
public class FarmerOrderController {

    private final FarmerOrderService farmerOrderService;
    private final UserRepository userRepository;

    @Autowired
    public FarmerOrderController(FarmerOrderService farmerOrderService, UserRepository userRepository) {
        this.farmerOrderService = farmerOrderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedFarmer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated farmer not found."));
    }

    /**
     * Get all incoming orders containing produce from the logged-in farmer.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getFarmerOrders(Authentication authentication) {
        User farmer = getAuthenticatedFarmer(authentication);
        List<OrderResponse> orders = farmerOrderService.getFarmerOrders(farmer);
        return ResponseEntity.ok(orders);
    }

    /**
     * Update order fulfillment / delivery status.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            Authentication authentication,
            @PathVariable("id") UUID id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        User farmer = getAuthenticatedFarmer(authentication);
        OrderResponse order = farmerOrderService.updateOrderStatus(farmer, id, request.getStatus());
        return ResponseEntity.ok(order);
    }
}

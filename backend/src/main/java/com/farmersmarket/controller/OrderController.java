package com.farmersmarket.controller;

import com.farmersmarket.dto.CreateOrderRequest;
import com.farmersmarket.dto.DeliveryResponse;
import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/orders")
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @Autowired
    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedCustomer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found."));
    }

    /**
     * Get list of all orders for authenticated customer.
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(Authentication authentication) {
        User user = getAuthenticatedCustomer(authentication);
        List<OrderResponse> orders = orderService.getCustomerOrders(user);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get specific order details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(Authentication authentication, @PathVariable("id") UUID id) {
        User user = getAuthenticatedCustomer(authentication);
        OrderResponse order = orderService.getCustomerOrderById(user, id);
        return ResponseEntity.ok(order);
    }

    /**
     * Get delivery tracking info.
     */
    @GetMapping("/{id}/delivery")
    public ResponseEntity<DeliveryResponse> getOrderDelivery(Authentication authentication, @PathVariable("id") UUID id) {
        User user = getAuthenticatedCustomer(authentication);
        DeliveryResponse delivery = orderService.getCustomerOrderDelivery(user, id);
        return ResponseEntity.ok(delivery);
    }

    /**
     * Place order from current shopping cart.
     */
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            Authentication authentication,
            @Valid @RequestBody CreateOrderRequest request) {
        User user = getAuthenticatedCustomer(authentication);
        OrderResponse order = orderService.placeOrder(user, request);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    /**
     * Cancel an order before processing/shipment.
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(Authentication authentication, @PathVariable("id") UUID id) {
        User user = getAuthenticatedCustomer(authentication);
        OrderResponse order = orderService.cancelOrder(user, id);
        return ResponseEntity.ok(order);
    }
}

package com.farmersmarket.controller;

import com.farmersmarket.dto.AddToCartRequest;
import com.farmersmarket.dto.CartResponse;
import com.farmersmarket.dto.UpdateCartItemRequest;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/customer/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @Autowired
    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedCustomer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found."));
    }

    /**
     * Get authenticated customer's shopping cart.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        User customerUser = getAuthenticatedCustomer(authentication);
        CartResponse response = cartService.getCart(customerUser);
        return ResponseEntity.ok(response);
    }

    /**
     * Add produce item to cart with stock validation.
     */
    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        User customerUser = getAuthenticatedCustomer(authentication);
        CartResponse response = cartService.addToCart(customerUser, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update quantity of a cart line item.
     */
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItemQuantity(
            Authentication authentication,
            @PathVariable("cartItemId") UUID cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        User customerUser = getAuthenticatedCustomer(authentication);
        CartResponse response = cartService.updateCartItemQuantity(customerUser, cartItemId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove single line item from cart.
     */
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeCartItem(
            Authentication authentication,
            @PathVariable("cartItemId") UUID cartItemId) {
        User customerUser = getAuthenticatedCustomer(authentication);
        CartResponse response = cartService.removeCartItem(customerUser, cartItemId);
        return ResponseEntity.ok(response);
    }

    /**
     * Clear all items from customer's cart.
     */
    @DeleteMapping
    public ResponseEntity<CartResponse> clearCart(Authentication authentication) {
        User customerUser = getAuthenticatedCustomer(authentication);
        CartResponse response = cartService.clearCart(customerUser);
        return ResponseEntity.ok(response);
    }
}

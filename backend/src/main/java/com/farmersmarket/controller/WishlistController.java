package com.farmersmarket.controller;

import com.farmersmarket.dto.WishlistItemResponse;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/wishlist")
@PreAuthorize("hasRole('CUSTOMER')")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @Autowired
    public WishlistController(WishlistService wishlistService, UserRepository userRepository) {
        this.wishlistService = wishlistService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedCustomer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found."));
    }

    /**
     * Get authenticated customer's wishlist.
     */
    @GetMapping
    public ResponseEntity<List<WishlistItemResponse>> getWishlist(Authentication authentication) {
        User customerUser = getAuthenticatedCustomer(authentication);
        List<WishlistItemResponse> wishlist = wishlistService.getWishlist(customerUser);
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Add product to wishlist.
     */
    @PostMapping("/{productId}")
    public ResponseEntity<List<WishlistItemResponse>> addToWishlist(
            Authentication authentication,
            @PathVariable("productId") UUID productId) {
        User customerUser = getAuthenticatedCustomer(authentication);
        List<WishlistItemResponse> wishlist = wishlistService.addToWishlist(customerUser, productId);
        return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
    }

    /**
     * Remove product from wishlist.
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<List<WishlistItemResponse>> removeFromWishlist(
            Authentication authentication,
            @PathVariable("productId") UUID productId) {
        User customerUser = getAuthenticatedCustomer(authentication);
        List<WishlistItemResponse> wishlist = wishlistService.removeFromWishlist(customerUser, productId);
        return ResponseEntity.ok(wishlist);
    }
}

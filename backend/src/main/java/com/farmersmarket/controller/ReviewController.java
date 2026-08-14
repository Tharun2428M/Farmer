package com.farmersmarket.controller;

import com.farmersmarket.dto.CreateReviewRequest;
import com.farmersmarket.dto.ReviewResponse;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.ReviewService;
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

import java.util.List;
import java.util.UUID;

@RestController
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @Autowired
    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedCustomer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found."));
    }

    /**
     * Public endpoint: Get reviews for a specific product.
     */
    @GetMapping("/api/products/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable("productId") UUID productId) {
        List<ReviewResponse> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Customer endpoint: Submit verified purchase review.
     */
    @PostMapping("/api/customer/products/{productId}/reviews")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> createReview(
            Authentication authentication,
            @PathVariable("productId") UUID productId,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = getAuthenticatedCustomer(authentication);
        ReviewResponse review = reviewService.createReview(user, productId, request);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    /**
     * Customer endpoint: Update review.
     */
    @PutMapping("/api/customer/reviews/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponse> updateReview(
            Authentication authentication,
            @PathVariable("reviewId") UUID reviewId,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = getAuthenticatedCustomer(authentication);
        ReviewResponse review = reviewService.updateReview(user, reviewId, request);
        return ResponseEntity.ok(review);
    }

    /**
     * Customer endpoint: Delete review.
     */
    @DeleteMapping("/api/customer/reviews/{reviewId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Void> deleteReview(
            Authentication authentication,
            @PathVariable("reviewId") UUID reviewId) {
        User user = getAuthenticatedCustomer(authentication);
        reviewService.deleteReview(user, reviewId);
        return ResponseEntity.noContent().build();
    }
}

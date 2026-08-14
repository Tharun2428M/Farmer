package com.farmersmarket.service;

import com.farmersmarket.dto.CreateReviewRequest;
import com.farmersmarket.dto.ReviewResponse;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.NotificationType;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.Review;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final CustomerProfileService customerProfileService;
    private final NotificationService notificationService;

    @Autowired
    public ReviewService(
            ReviewRepository reviewRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            CustomerProfileService customerProfileService,
            NotificationService notificationService) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.customerProfileService = customerProfileService;
        this.notificationService = notificationService;
    }

    /**
     * Get public reviews for a product.
     */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getProductReviews(UUID productId) {
        List<Review> reviews = reviewRepository.findByProductIdWithDetails(productId);
        return reviews.stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create verified purchase review.
     */
    @Transactional
    public ReviewResponse createReview(User customerUser, UUID productId, CreateReviewRequest request) {
        CustomerProfile customer = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " was not found."));

        // 1. Verify that customer has an order containing this product with DELIVERED status
        boolean hasDelivered = orderRepository.hasCustomerDeliveredProduct(customer.getId(), productId);
        if (!hasDelivered) {
            throw new AccessDeniedException("You can only review produce items from completed orders that have been delivered to you.");
        }

        // 2. Prevent duplicate reviews
        Optional<Review> existingReview = reviewRepository.findByProduct_IdAndCustomer_Id(productId, customer.getId());
        if (existingReview.isPresent()) {
            throw new IllegalArgumentException("You have already reviewed this produce item. Please edit your existing review.");
        }

        // 3. Create Review
        Review review = new Review(
                product,
                customer,
                request.getRating(),
                request.getComment()
        );
        Review saved = reviewRepository.save(review);

        // 4. Send notification to the Farmer
        if (product.getFarmer() != null && product.getFarmer().getUser() != null) {
            notificationService.sendNotification(
                    product.getFarmer().getUser(),
                    "New Crop Review (" + request.getRating() + "★)",
                    "A verified customer reviewed your '" + product.getTitle() + "': \"" + 
                            (request.getComment() != null ? request.getComment() : "No comment") + "\"",
                    NotificationType.REVIEW_RECEIVED
            );
        }

        return ReviewResponse.fromEntity(saved);
    }

    /**
     * Update customer's review.
     */
    @Transactional
    public ReviewResponse updateReview(User customerUser, UUID reviewId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review with ID " + reviewId + " was not found."));

        if (!review.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this review.");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        Review saved = reviewRepository.save(review);
        return ReviewResponse.fromEntity(saved);
    }

    /**
     * Delete customer's review.
     */
    @Transactional
    public void deleteReview(User customerUser, UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review with ID " + reviewId + " was not found."));

        if (!review.getCustomer().getId().equals(customerUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this review.");
        }

        reviewRepository.delete(review);
    }
}

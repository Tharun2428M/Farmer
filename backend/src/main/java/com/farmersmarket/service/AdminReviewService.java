package com.farmersmarket.service;

import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.ReviewResponse;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.Review;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminReviewService {

    private final ReviewRepository reviewRepository;
    private final FarmerProfileRepository farmerProfileRepository;

    @Autowired
    public AdminReviewService(
            ReviewRepository reviewRepository,
            FarmerProfileRepository farmerProfileRepository) {
        this.reviewRepository = reviewRepository;
        this.farmerProfileRepository = farmerProfileRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponse> getReviews(Integer rating, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<Review> reviewPage = reviewRepository.findAdminReviewsWithFilters(rating, cleanQuery, pageable);

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                reviewPage.getNumber(),
                reviewPage.getSize(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                reviewPage.isLast()
        );
    }

    @Transactional
    public void deleteReview(UUID id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review with ID " + id + " not found."));

        Product product = review.getProduct();
        FarmerProfile farmer = product != null ? product.getFarmer() : null;

        reviewRepository.delete(review);

        // Recalculate farmer rating
        if (farmer != null) {
            Double avg = reviewRepository.getAverageRatingByProductId(product.getId());
            if (avg != null) {
                farmer.setRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            } else {
                farmer.setRating(BigDecimal.ZERO);
            }
            farmerProfileRepository.save(farmer);
        }
    }
}

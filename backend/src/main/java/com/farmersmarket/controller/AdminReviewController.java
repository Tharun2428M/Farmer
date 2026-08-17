package com.farmersmarket.controller;

import com.farmersmarket.dto.ApiResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.ReviewResponse;
import com.farmersmarket.service.AdminReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reviews")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    @Autowired
    public AdminReviewController(AdminReviewService adminReviewService) {
        this.adminReviewService = adminReviewService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<ReviewResponse>> getReviews(
            @RequestParam(value = "rating", required = false) Integer rating,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<ReviewResponse> reviews = adminReviewService.getReviews(rating, query, page, size);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable("id") UUID id) {
        adminReviewService.deleteReview(id);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Review removed by administrator."));
    }
}

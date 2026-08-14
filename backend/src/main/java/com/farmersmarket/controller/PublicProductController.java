package com.farmersmarket.controller;

import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.PublicProductResponse;
import com.farmersmarket.service.PublicProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class PublicProductController {

    private final PublicProductService publicProductService;

    @Autowired
    public PublicProductController(PublicProductService publicProductService) {
        this.publicProductService = publicProductService;
    }

    /**
     * Browse active agricultural products with search, category filter, price range, sorting, and pagination.
     */
    @GetMapping
    public ResponseEntity<PageResponse<PublicProductResponse>> getProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "sort", defaultValue = "newest") String sort,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size) {

        PageResponse<PublicProductResponse> response = publicProductService.getPublicProducts(
                keyword, categoryId, minPrice, maxPrice, sort, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Convenience search endpoint.
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<PublicProductResponse>> searchProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(name = "sort", defaultValue = "newest") String sort,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size) {

        PageResponse<PublicProductResponse> response = publicProductService.getPublicProducts(
                keyword, categoryId, minPrice, maxPrice, sort, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get single active product details with farmer summary.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PublicProductResponse> getProductById(@PathVariable("id") UUID id) {
        PublicProductResponse response = publicProductService.getPublicProductById(id);
        return ResponseEntity.ok(response);
    }
}

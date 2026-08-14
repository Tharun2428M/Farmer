package com.farmersmarket.service;

import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.PublicProductResponse;
import com.farmersmarket.entity.Product;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.specification.ProductSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PublicProductService {

    private final ProductRepository productRepository;

    @Autowired
    public PublicProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Browse active marketplace products with safe dynamic filtering, sorting, and pagination.
     */
    @Transactional(readOnly = true)
    public PageResponse<PublicProductResponse> getPublicProducts(
            String keyword,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String sortOption,
            int page,
            int size) {

        // 1. Price validation
        if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Minimum price cannot be negative.");
        }
        if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Maximum price cannot be negative.");
        }
        if (minPrice != null && maxPrice != null && maxPrice.compareTo(minPrice) < 0) {
            throw new IllegalArgumentException("Maximum price cannot be less than minimum price.");
        }

        // 2. Safe Whitelisted Sorting
        Sort sort = resolveSort(sortOption);

        // 3. Bound Pagination Parameters
        int boundedPage = Math.max(0, page);
        int boundedSize = Math.min(50, Math.max(1, size > 0 ? size : 12));
        Pageable pageable = PageRequest.of(boundedPage, boundedSize, sort);

        // 4. Specification Query
        Specification<Product> spec = ProductSpecification.filterProducts(keyword, categoryId, minPrice, maxPrice);
        Page<Product> productPage = productRepository.findAll(spec, pageable);

        // 5. Convert to DTO
        Page<PublicProductResponse> dtoPage = productPage.map(PublicProductResponse::fromEntity);
        return PageResponse.fromPage(dtoPage);
    }

    /**
     * Get active product details for public customer view.
     * Returns 404 if product does not exist or is deactivated.
     */
    @Transactional(readOnly = true)
    public PublicProductResponse getPublicProductById(UUID id) {
        Product product = productRepository.findByIdAndIsActiveTrueWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " was not found or is currently inactive."));

        return PublicProductResponse.fromEntity(product);
    }

    /**
     * Resolve sort string into safe Spring Data Sort object to prevent SQL injection.
     */
    private Sort resolveSort(String sortOption) {
        if (sortOption == null) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        switch (sortOption.toLowerCase().trim()) {
            case "price-low":
            case "price_asc":
                return Sort.by(Sort.Direction.ASC, "pricePerUnit");
            case "price-high":
            case "price_desc":
                return Sort.by(Sort.Direction.DESC, "pricePerUnit");
            case "name-asc":
            case "title_asc":
                return Sort.by(Sort.Direction.ASC, "title");
            case "name-desc":
            case "title_desc":
                return Sort.by(Sort.Direction.DESC, "title");
            case "newest":
            default:
                return Sort.by(Sort.Direction.DESC, "createdAt");
        }
    }
}

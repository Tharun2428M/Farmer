package com.farmersmarket.service;

import com.farmersmarket.dto.AdminProductDto;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.Product;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminProductService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public AdminProductService(
            ProductRepository productRepository,
            OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminProductDto> getProducts(
            Long categoryId,
            UUID farmerId,
            Boolean isActive,
            String query,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<Product> productPage = productRepository.findAdminProductsWithFilters(
                categoryId,
                farmerId,
                isActive,
                cleanQuery,
                pageable
        );

        List<AdminProductDto> content = productPage.getContent().stream()
                .map(AdminProductDto::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public AdminProductDto getProductById(UUID id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " not found."));
        return AdminProductDto.fromEntity(product);
    }

    @Transactional
    public AdminProductDto setProductStatus(UUID id, boolean isActive) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " not found."));
        product.setIsActive(isActive);
        Product saved = productRepository.save(product);
        return AdminProductDto.fromEntity(saved);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + id + " not found."));

        long orderCount = orderItemRepository.countByProduct_Id(id);
        if (orderCount > 0) {
            // Safety: Soft-deactivate if order history exists to preserve customer/farmer audit trails
            product.setIsActive(false);
            productRepository.save(product);
        } else {
            productRepository.delete(product);
        }
    }

    @Transactional(readOnly = true)
    public List<AdminProductDto> getLowStockProducts() {
        List<Product> products = productRepository.findLowStockProducts();
        return products.stream()
                .map(AdminProductDto::fromEntity)
                .collect(Collectors.toList());
    }
}

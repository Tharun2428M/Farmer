package com.farmersmarket.service;

import com.farmersmarket.dto.FarmerStatsDto;
import com.farmersmarket.dto.InventoryDto;
import com.farmersmarket.dto.InventoryUpdateRequest;
import com.farmersmarket.dto.ProductCreateRequest;
import com.farmersmarket.dto.ProductResponse;
import com.farmersmarket.dto.ProductUpdateRequest;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Inventory;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final CategoryRepository categoryRepository;
    private final FarmerProfileService farmerProfileService;

    @Autowired
    public ProductService(
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            CategoryRepository categoryRepository,
            FarmerProfileService farmerProfileService) {
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
        this.farmerProfileService = farmerProfileService;
    }

    /**
     * Create agricultural produce listing and initial inventory.
     */
    @Transactional
    public ProductResponse createProduct(User farmerUser, ProductCreateRequest request) {
        FarmerProfile farmerProfile = farmerProfileService.getOrCreateFarmerProfileEntity(farmerUser);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category with ID " + request.getCategoryId() + " does not exist."));

        Product product = new Product();
        product.setFarmer(farmerProfile);
        product.setCategory(category);
        product.setTitle(request.getTitle().trim());
        product.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        product.setPricePerUnit(request.getPricePerUnit());
        product.setUnit(request.getUnit().trim());
        product.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
        product.setIsActive(true);

        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setStockQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        inventory.setLowStockThreshold(request.getLowStockThreshold() != null ? request.getLowStockThreshold() : 5);

        product.setInventory(inventory);

        Product savedProduct = productRepository.save(product);
        return ProductResponse.fromEntity(savedProduct);
    }

    /**
     * Get all produce listings belonging to the authenticated farmer.
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByFarmer(User farmerUser) {
        return productRepository.findByFarmerIdWithDetails(farmerUser.getId()).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get single product with strict ownership verification.
     */
    @Transactional(readOnly = true)
    public ProductResponse getProductResponseById(UUID productId, User farmerUser) {
        Product product = getProductByIdAndVerifyOwnership(productId, farmerUser);
        return ProductResponse.fromEntity(product);
    }

    /**
     * Update product details with strict ownership verification.
     */
    @Transactional
    public ProductResponse updateProduct(UUID productId, User farmerUser, ProductUpdateRequest request) {
        Product product = getProductByIdAndVerifyOwnership(productId, farmerUser);

        if (request.getCategoryId() != null && (product.getCategory() == null || !product.getCategory().getId().equals(request.getCategoryId()))) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category with ID " + request.getCategoryId() + " does not exist."));
            product.setCategory(category);
        }

        if (request.getTitle() != null) product.setTitle(request.getTitle().trim());
        if (request.getDescription() != null) product.setDescription(request.getDescription().trim());
        if (request.getPricePerUnit() != null) product.setPricePerUnit(request.getPricePerUnit());
        if (request.getUnit() != null) product.setUnit(request.getUnit().trim());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl().trim());
        if (request.getIsActive() != null) product.setIsActive(request.getIsActive());

        // Update inventory if requested
        if (product.getInventory() != null) {
            if (request.getQuantity() != null) {
                product.getInventory().setStockQuantity(request.getQuantity());
            }
            if (request.getLowStockThreshold() != null) {
                product.getInventory().setLowStockThreshold(request.getLowStockThreshold());
            }
        }

        Product updatedProduct = productRepository.save(product);
        return ProductResponse.fromEntity(updatedProduct);
    }

    /**
     * Deactivate / delete product with strict ownership verification.
     */
    @Transactional
    public void deleteProduct(UUID productId, User farmerUser) {
        Product product = getProductByIdAndVerifyOwnership(productId, farmerUser);
        // Soft delete / deactivation preserves order history integrity
        product.setIsActive(false);
        productRepository.save(product);
    }

    /**
     * Get inventory for a specific product with strict ownership verification.
     */
    @Transactional(readOnly = true)
    public InventoryDto getInventory(UUID productId, User farmerUser) {
        Product product = getProductByIdAndVerifyOwnership(productId, farmerUser);
        if (product.getInventory() == null) {
            throw new ResourceNotFoundException("Inventory not found for product ID " + productId);
        }
        return InventoryDto.fromEntity(product.getInventory());
    }

    /**
     * Update inventory stock quantity with strict ownership verification.
     */
    @Transactional
    public InventoryDto updateInventory(UUID productId, User farmerUser, InventoryUpdateRequest request) {
        Product product = getProductByIdAndVerifyOwnership(productId, farmerUser);
        Inventory inventory = product.getInventory();
        if (inventory == null) {
            inventory = new Inventory(product, request.getQuantity(), request.getLowStockThreshold());
            product.setInventory(inventory);
        } else {
            inventory.setStockQuantity(request.getQuantity());
            if (request.getLowStockThreshold() != null) {
                inventory.setLowStockThreshold(request.getLowStockThreshold());
            }
        }
        Inventory saved = inventoryRepository.save(inventory);
        return InventoryDto.fromEntity(saved);
    }

    /**
     * Compute real farmer dashboard metrics.
     */
    @Transactional(readOnly = true)
    public FarmerStatsDto getFarmerStats(User farmerUser) {
        List<Product> products = productRepository.findByFarmerIdWithDetails(farmerUser.getId());

        long totalProducts = products.size();
        long activeProducts = products.stream().filter(p -> Boolean.TRUE.equals(p.getIsActive())).count();
        
        long outOfStockProducts = products.stream()
                .filter(p -> p.getInventory() == null || p.getInventory().getStockQuantity() == 0)
                .count();

        long lowStockProducts = products.stream()
                .filter(p -> p.getInventory() != null && p.getInventory().getStockQuantity() > 0 && p.getInventory().getStockQuantity() <= p.getInventory().getLowStockThreshold())
                .count();

        long totalInventoryQuantity = products.stream()
                .filter(p -> p.getInventory() != null)
                .mapToLong(p -> p.getInventory().getStockQuantity())
                .sum();

        return new FarmerStatsDto(totalProducts, activeProducts, lowStockProducts, outOfStockProducts, totalInventoryQuantity);
    }

    /**
     * Internal helper to retrieve Product and verify that it belongs to the logged-in farmer.
     * Throws 404 ResourceNotFoundException if product does not exist.
     * Throws 403 AccessDeniedException if product belongs to another farmer.
     */
    public Product getProductByIdAndVerifyOwnership(UUID productId, User farmerUser) {
        Product product = productRepository.findByIdWithDetails(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " was not found."));

        if (!product.getFarmer().getId().equals(farmerUser.getId())) {
            throw new AccessDeniedException("Access denied: You do not have permission to access or modify this product.");
        }

        return product;
    }
}

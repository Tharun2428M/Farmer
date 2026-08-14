package com.farmersmarket.controller;

import com.farmersmarket.dto.ApiResponse;
import com.farmersmarket.dto.FarmerStatsDto;
import com.farmersmarket.dto.InventoryDto;
import com.farmersmarket.dto.InventoryUpdateRequest;
import com.farmersmarket.dto.ProductCreateRequest;
import com.farmersmarket.dto.ProductResponse;
import com.farmersmarket.dto.ProductUpdateRequest;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/farmer")
public class FarmerProductController {

    private final ProductService productService;
    private final UserRepository userRepository;

    @Autowired
    public FarmerProductController(ProductService productService, UserRepository userRepository) {
        this.productService = productService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedFarmer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated farmer user not found."));
    }

    /**
     * Get farmer dashboard statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<FarmerStatsDto> getFarmerStats(Authentication authentication) {
        User farmer = getAuthenticatedFarmer(authentication);
        FarmerStatsDto stats = productService.getFarmerStats(farmer);
        return ResponseEntity.ok(stats);
    }

    /**
     * Create new agricultural produce item.
     */
    @PostMapping("/products")
    public ResponseEntity<ProductResponse> createProduct(
            Authentication authentication,
            @Valid @RequestBody ProductCreateRequest request) {
        User farmer = getAuthenticatedFarmer(authentication);
        ProductResponse response = productService.createProduct(farmer, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Get all produce listings for the authenticated farmer.
     */
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getFarmerProducts(Authentication authentication) {
        User farmer = getAuthenticatedFarmer(authentication);
        List<ProductResponse> products = productService.getProductsByFarmer(farmer);
        return ResponseEntity.ok(products);
    }

    /**
     * Get a single product by ID (with ownership check).
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            Authentication authentication,
            @PathVariable("id") UUID id) {
        User farmer = getAuthenticatedFarmer(authentication);
        ProductResponse product = productService.getProductResponseById(id, farmer);
        return ResponseEntity.ok(product);
    }

    /**
     * Update product details by ID (with ownership check).
     */
    @PutMapping("/products/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            Authentication authentication,
            @PathVariable("id") UUID id,
            @Valid @RequestBody ProductUpdateRequest request) {
        User farmer = getAuthenticatedFarmer(authentication);
        ProductResponse response = productService.updateProduct(id, farmer, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deactivate / delete product by ID (with ownership check).
     */
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            Authentication authentication,
            @PathVariable("id") UUID id) {
        User farmer = getAuthenticatedFarmer(authentication);
        productService.deleteProduct(id, farmer);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Product was deactivated/deleted successfully"));
    }

    /**
     * Get inventory for product (with ownership check).
     */
    @GetMapping("/products/{id}/inventory")
    public ResponseEntity<InventoryDto> getInventory(
            Authentication authentication,
            @PathVariable("id") UUID id) {
        User farmer = getAuthenticatedFarmer(authentication);
        InventoryDto inventory = productService.getInventory(id, farmer);
        return ResponseEntity.ok(inventory);
    }

    /**
     * Update inventory stock for product (with ownership check).
     */
    @PutMapping("/products/{id}/inventory")
    public ResponseEntity<InventoryDto> updateInventory(
            Authentication authentication,
            @PathVariable("id") UUID id,
            @Valid @RequestBody InventoryUpdateRequest request) {
        User farmer = getAuthenticatedFarmer(authentication);
        InventoryDto inventory = productService.updateInventory(id, farmer, request);
        return ResponseEntity.ok(inventory);
    }
}

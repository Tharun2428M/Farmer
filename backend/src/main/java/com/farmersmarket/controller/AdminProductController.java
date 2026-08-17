package com.farmersmarket.controller;

import com.farmersmarket.dto.AdminProductDto;
import com.farmersmarket.dto.ApiResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.service.AdminProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final AdminProductService adminProductService;

    @Autowired
    public AdminProductController(AdminProductService adminProductService) {
        this.adminProductService = adminProductService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AdminProductDto>> getProducts(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "farmerId", required = false) UUID farmerId,
            @RequestParam(value = "isActive", required = false) Boolean isActive,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        PageResponse<AdminProductDto> products = adminProductService.getProducts(categoryId, farmerId, isActive, query, page, size);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<AdminProductDto>> getLowStockProducts() {
        List<AdminProductDto> lowStock = adminProductService.getLowStockProducts();
        return ResponseEntity.ok(lowStock);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminProductDto> getProductById(@PathVariable("id") UUID id) {
        AdminProductDto product = adminProductService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AdminProductDto> setProductStatus(
            @PathVariable("id") UUID id,
            @RequestParam("isActive") boolean isActive) {
        AdminProductDto updated = adminProductService.setProductStatus(id, isActive);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable("id") UUID id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Product deleted / deactivated successfully."));
    }
}

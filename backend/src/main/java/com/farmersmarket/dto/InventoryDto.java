package com.farmersmarket.dto;

import com.farmersmarket.entity.Inventory;

import java.time.OffsetDateTime;
import java.util.UUID;

public class InventoryDto {
    private UUID id;
    private UUID productId;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private OffsetDateTime updatedAt;

    public InventoryDto() {
    }

    public static InventoryDto fromEntity(Inventory inventory) {
        if (inventory == null) return null;
        InventoryDto dto = new InventoryDto();
        dto.setId(inventory.getId());
        if (inventory.getProduct() != null) {
            dto.setProductId(inventory.getProduct().getId());
        }
        dto.setStockQuantity(inventory.getStockQuantity());
        dto.setLowStockThreshold(inventory.getLowStockThreshold());
        dto.setUpdatedAt(inventory.getUpdatedAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Integer getLowStockThreshold() {
        return lowStockThreshold;
    }

    public void setLowStockThreshold(Integer lowStockThreshold) {
        this.lowStockThreshold = lowStockThreshold;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

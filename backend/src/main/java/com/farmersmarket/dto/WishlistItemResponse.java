package com.farmersmarket.dto;

import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.Wishlist;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class WishlistItemResponse {

    private UUID id;
    private UUID productId;
    private String title;
    private String description;
    private String imageUrl;
    private String unit;
    private BigDecimal pricePerUnit;
    private Integer stockQuantity;
    private String farmName;
    private String farmerName;
    private boolean isAvailable;
    private OffsetDateTime createdAt;

    public WishlistItemResponse() {
    }

    public static WishlistItemResponse fromEntity(Wishlist wishlist) {
        if (wishlist == null) return null;

        WishlistItemResponse response = new WishlistItemResponse();
        response.setId(wishlist.getId());
        response.setCreatedAt(wishlist.getCreatedAt());

        Product product = wishlist.getProduct();
        if (product != null) {
            response.setProductId(product.getId());
            response.setTitle(product.getTitle());
            response.setDescription(product.getDescription());
            response.setImageUrl(product.getImageUrl());
            response.setUnit(product.getUnit());
            response.setPricePerUnit(product.getPricePerUnit());

            int stock = product.getInventory() != null ? product.getInventory().getStockQuantity() : 0;
            response.setStockQuantity(stock);
            response.setAvailable(product.getIsActive() != null && product.getIsActive() && stock > 0);

            if (product.getFarmer() != null) {
                response.setFarmName(product.getFarmer().getFarmName());
                if (product.getFarmer().getUser() != null) {
                    response.setFarmerName(product.getFarmer().getUser().getName());
                }
            }
        }

        return response;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

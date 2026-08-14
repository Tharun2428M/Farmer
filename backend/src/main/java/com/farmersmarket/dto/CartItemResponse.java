package com.farmersmarket.dto;

import com.farmersmarket.entity.CartItem;
import com.farmersmarket.entity.Product;

import java.math.BigDecimal;
import java.util.UUID;

public class CartItemResponse {

    private UUID id;
    private UUID productId;
    private String title;
    private String description;
    private String imageUrl;
    private String unit;
    private BigDecimal pricePerUnit;
    private Integer quantity;
    private BigDecimal subtotal;
    private Integer stockQuantity;
    private String farmName;
    private String farmerName;
    private boolean isAvailable;

    public CartItemResponse() {
    }

    public static CartItemResponse fromEntity(CartItem item) {
        if (item == null) return null;

        CartItemResponse response = new CartItemResponse();
        response.setId(item.getId());
        response.setQuantity(item.getQuantity());

        Product product = item.getProduct();
        if (product != null) {
            response.setProductId(product.getId());
            response.setTitle(product.getTitle());
            response.setDescription(product.getDescription());
            response.setImageUrl(product.getImageUrl());
            response.setUnit(product.getUnit());
            response.setPricePerUnit(product.getPricePerUnit());

            // Subtotal = current product price * quantity
            if (product.getPricePerUnit() != null && item.getQuantity() != null) {
                response.setSubtotal(product.getPricePerUnit().multiply(BigDecimal.valueOf(item.getQuantity())));
            } else {
                response.setSubtotal(BigDecimal.ZERO);
            }

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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
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
}

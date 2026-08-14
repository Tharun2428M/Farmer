package com.farmersmarket.dto;

import com.farmersmarket.entity.OrderItem;

import java.math.BigDecimal;
import java.util.UUID;

public class OrderItemResponse {

    private UUID id;
    private UUID productId;
    private String productTitle;
    private String productImageUrl;
    private String unit;
    private UUID farmerId;
    private String farmerName;
    private String farmName;
    private Integer quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal subtotal;

    public OrderItemResponse() {
    }

    public static OrderItemResponse fromEntity(OrderItem item) {
        if (item == null) return null;
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        if (item.getProduct() != null) {
            response.setProductId(item.getProduct().getId());
            response.setProductTitle(item.getProduct().getTitle());
            response.setProductImageUrl(item.getProduct().getImageUrl());
            response.setUnit(item.getProduct().getUnit());
        }
        if (item.getFarmer() != null) {
            response.setFarmerId(item.getFarmer().getId());
            response.setFarmName(item.getFarmer().getFarmName());
            if (item.getFarmer().getUser() != null) {
                response.setFarmerName(item.getFarmer().getUser().getName());
            }
        }
        response.setQuantity(item.getQuantity());
        response.setPricePerUnit(item.getPricePerUnit());
        response.setSubtotal(item.getSubtotal());
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

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public UUID getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(UUID farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}

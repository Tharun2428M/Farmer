package com.farmersmarket.dto;

import com.farmersmarket.entity.FarmerProfile;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class AdminFarmerDto {
    private UUID id;
    private String farmName;
    private String farmDescription;
    private String farmAddress;
    private BigDecimal rating;
    private String ownerName;
    private String email;
    private String phone;
    private String status;
    private OffsetDateTime createdAt;
    private long totalProducts;
    private long activeProducts;
    private long totalOrders;

    public AdminFarmerDto() {
    }

    public static AdminFarmerDto fromEntity(FarmerProfile farmer) {
        if (farmer == null) return null;
        AdminFarmerDto dto = new AdminFarmerDto();
        dto.setId(farmer.getId());
        dto.setFarmName(farmer.getFarmName());
        dto.setFarmDescription(farmer.getFarmDescription());
        dto.setFarmAddress(farmer.getFarmAddress());
        dto.setRating(farmer.getRating());
        dto.setCreatedAt(farmer.getCreatedAt());

        if (farmer.getUser() != null) {
            dto.setOwnerName(farmer.getUser().getName());
            dto.setEmail(farmer.getUser().getEmail());
            dto.setPhone(farmer.getUser().getPhone());
            dto.setStatus(farmer.getUser().getStatus());
        }
        return dto;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getFarmDescription() {
        return farmDescription;
    }

    public void setFarmDescription(String farmDescription) {
        this.farmDescription = farmDescription;
    }

    public String getFarmAddress() {
        return farmAddress;
    }

    public void setFarmAddress(String farmAddress) {
        this.farmAddress = farmAddress;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getActiveProducts() {
        return activeProducts;
    }

    public void setActiveProducts(long activeProducts) {
        this.activeProducts = activeProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }
}

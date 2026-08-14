package com.farmersmarket.dto;

import com.farmersmarket.entity.Product;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PublicProductResponse {

    private UUID id;
    private String title;
    private String description;
    private BigDecimal pricePerUnit;
    private String unit;
    private String imageUrl;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private CategorySummary category;
    private FarmerPublicSummary farmer;
    private OffsetDateTime createdAt;

    public PublicProductResponse() {
    }

    public static PublicProductResponse fromEntity(Product product) {
        if (product == null) return null;

        PublicProductResponse response = new PublicProductResponse();
        response.setId(product.getId());
        response.setTitle(product.getTitle());
        response.setDescription(product.getDescription());
        response.setPricePerUnit(product.getPricePerUnit());
        response.setUnit(product.getUnit());
        response.setImageUrl(product.getImageUrl());
        response.setCreatedAt(product.getCreatedAt());

        if (product.getInventory() != null) {
            response.setStockQuantity(product.getInventory().getStockQuantity());
            response.setLowStockThreshold(product.getInventory().getLowStockThreshold());
        } else {
            response.setStockQuantity(0);
            response.setLowStockThreshold(5);
        }

        if (product.getCategory() != null) {
            CategorySummary catSummary = new CategorySummary(
                    product.getCategory().getId(),
                    product.getCategory().getName(),
                    product.getCategory().getIconName()
            );
            response.setCategory(catSummary);
        }

        if (product.getFarmer() != null) {
            String farmerName = product.getFarmer().getUser() != null ? product.getFarmer().getUser().getName() : "Local Grower";
            FarmerPublicSummary farmerSummary = new FarmerPublicSummary(
                    product.getFarmer().getId(),
                    farmerName,
                    product.getFarmer().getFarmName(),
                    product.getFarmer().getFarmAddress(),
                    product.getFarmer().getFarmDescription(),
                    product.getFarmer().getRating()
            );
            response.setFarmer(farmerSummary);
        }

        return response;
    }

    // Nested Category Summary DTO
    public static class CategorySummary {
        private Long id;
        private String name;
        private String iconName;

        public CategorySummary() {}

        public CategorySummary(Long id, String name, String iconName) {
            this.id = id;
            this.name = name;
            this.iconName = iconName;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIconName() { return iconName; }
        public void setIconName(String iconName) { this.iconName = iconName; }
    }

    // Nested Public Farmer Summary DTO (no private info / password / email)
    public static class FarmerPublicSummary {
        private UUID id;
        private String name;
        private String farmName;
        private String location;
        private String description;
        private BigDecimal rating;

        public FarmerPublicSummary() {}

        public FarmerPublicSummary(UUID id, String name, String farmName, String location, String description, BigDecimal rating) {
            this.id = id;
            this.name = name;
            this.farmName = farmName;
            this.location = location;
            this.description = description;
            this.rating = rating;
        }

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getFarmName() { return farmName; }
        public void setFarmName(String farmName) { this.farmName = farmName; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public BigDecimal getRating() { return rating; }
        public void setRating(BigDecimal rating) { this.rating = rating; }
    }

    // Getters and Setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }
    public CategorySummary getCategory() { return category; }
    public void setCategory(CategorySummary category) { this.category = category; }
    public FarmerPublicSummary getFarmer() { return farmer; }
    public void setFarmer(FarmerPublicSummary farmer) { this.farmer = farmer; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}

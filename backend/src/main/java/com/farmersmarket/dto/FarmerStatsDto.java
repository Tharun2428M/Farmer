package com.farmersmarket.dto;

public class FarmerStatsDto {
    private long totalProducts;
    private long activeProducts;
    private long lowStockProducts;
    private long outOfStockProducts;
    private long totalInventoryQuantity;

    public FarmerStatsDto() {
    }

    public FarmerStatsDto(long totalProducts, long activeProducts, long lowStockProducts, long outOfStockProducts, long totalInventoryQuantity) {
        this.totalProducts = totalProducts;
        this.activeProducts = activeProducts;
        this.lowStockProducts = lowStockProducts;
        this.outOfStockProducts = outOfStockProducts;
        this.totalInventoryQuantity = totalInventoryQuantity;
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

    public long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public long getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public void setOutOfStockProducts(long outOfStockProducts) {
        this.outOfStockProducts = outOfStockProducts;
    }

    public long getTotalInventoryQuantity() {
        return totalInventoryQuantity;
    }

    public void setTotalInventoryQuantity(long totalInventoryQuantity) {
        this.totalInventoryQuantity = totalInventoryQuantity;
    }
}

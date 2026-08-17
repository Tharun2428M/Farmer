package com.farmersmarket.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardStatsDto {
    private long totalUsers;
    private long totalCustomers;
    private long totalFarmers;
    private long totalProducts;
    private long activeProducts;
    private long outOfStockProducts;
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private long cancelledOrders;
    private BigDecimal totalRevenue;
    private long pendingPayments;
    private long successfulPayments;
    private long lowStockCount;

    public AdminDashboardStatsDto() {
    }

    public AdminDashboardStatsDto(
            long totalUsers,
            long totalCustomers,
            long totalFarmers,
            long totalProducts,
            long activeProducts,
            long outOfStockProducts,
            long totalOrders,
            long pendingOrders,
            long completedOrders,
            long cancelledOrders,
            BigDecimal totalRevenue,
            long pendingPayments,
            long successfulPayments,
            long lowStockCount) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalFarmers = totalFarmers;
        this.totalProducts = totalProducts;
        this.activeProducts = activeProducts;
        this.outOfStockProducts = outOfStockProducts;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.pendingPayments = pendingPayments;
        this.successfulPayments = successfulPayments;
        this.lowStockCount = lowStockCount;
    }

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalFarmers() {
        return totalFarmers;
    }

    public void setTotalFarmers(long totalFarmers) {
        this.totalFarmers = totalFarmers;
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

    public long getOutOfStockProducts() {
        return outOfStockProducts;
    }

    public void setOutOfStockProducts(long outOfStockProducts) {
        this.outOfStockProducts = outOfStockProducts;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingPayments() {
        return pendingPayments;
    }

    public void setPendingPayments(long pendingPayments) {
        this.pendingPayments = pendingPayments;
    }

    public long getSuccessfulPayments() {
        return successfulPayments;
    }

    public void setSuccessfulPayments(long successfulPayments) {
        this.successfulPayments = successfulPayments;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }
}

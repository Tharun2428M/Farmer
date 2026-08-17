package com.farmersmarket.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminAnalyticsOverviewDto {
    // User metrics
    private long totalCustomers;
    private long totalFarmers;
    private long newUsersThisMonth;
    private long activeUsers;

    // Product metrics
    private long totalProducts;
    private long activeProducts;
    private long lowStockProducts;
    private long outOfStockProducts;

    // Order metrics
    private long totalOrders;
    private long completedOrders;
    private long pendingOrders;
    private long cancelledOrders;

    // Revenue metrics
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private BigDecimal thisMonthRevenue;
    private BigDecimal averageOrderValue;

    // Time-series chart datasets
    private List<AdminChartDataPointDto> ordersOverTime;
    private List<AdminChartDataPointDto> revenueOverTime;
    private List<AdminChartDataPointDto> categoryDistribution;
    private List<AdminChartDataPointDto> orderStatusDistribution;
    private List<AdminChartDataPointDto> topSellingProducts;
    private List<AdminFarmerDto> topFarmers;

    public AdminAnalyticsOverviewDto() {
    }

    // Getters and Setters
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

    public long getNewUsersThisMonth() {
        return newUsersThisMonth;
    }

    public void setNewUsersThisMonth(long newUsersThisMonth) {
        this.newUsersThisMonth = newUsersThisMonth;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
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

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
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

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public BigDecimal getThisMonthRevenue() {
        return thisMonthRevenue;
    }

    public void setThisMonthRevenue(BigDecimal thisMonthRevenue) {
        this.thisMonthRevenue = thisMonthRevenue;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public List<AdminChartDataPointDto> getOrdersOverTime() {
        return ordersOverTime;
    }

    public void setOrdersOverTime(List<AdminChartDataPointDto> ordersOverTime) {
        this.ordersOverTime = ordersOverTime;
    }

    public List<AdminChartDataPointDto> getRevenueOverTime() {
        return revenueOverTime;
    }

    public void setRevenueOverTime(List<AdminChartDataPointDto> revenueOverTime) {
        this.revenueOverTime = revenueOverTime;
    }

    public List<AdminChartDataPointDto> getCategoryDistribution() {
        return categoryDistribution;
    }

    public void setCategoryDistribution(List<AdminChartDataPointDto> categoryDistribution) {
        this.categoryDistribution = categoryDistribution;
    }

    public List<AdminChartDataPointDto> getOrderStatusDistribution() {
        return orderStatusDistribution;
    }

    public void setOrderStatusDistribution(List<AdminChartDataPointDto> orderStatusDistribution) {
        this.orderStatusDistribution = orderStatusDistribution;
    }

    public List<AdminChartDataPointDto> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<AdminChartDataPointDto> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }

    public List<AdminFarmerDto> getTopFarmers() {
        return topFarmers;
    }

    public void setTopFarmers(List<AdminFarmerDto> topFarmers) {
        this.topFarmers = topFarmers;
    }
}

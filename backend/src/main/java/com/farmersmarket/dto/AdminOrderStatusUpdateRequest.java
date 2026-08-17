package com.farmersmarket.dto;

import com.farmersmarket.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class AdminOrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    public AdminOrderStatusUpdateRequest() {
    }

    public AdminOrderStatusUpdateRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}

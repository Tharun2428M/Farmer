package com.farmersmarket.dto;

import com.farmersmarket.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AdminDeliveryUpdateRequest {

    private String deliveryPersonName;
    private String deliveryPersonPhone;

    @NotNull(message = "Delivery status is required")
    private DeliveryStatus status;

    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;

    public AdminDeliveryUpdateRequest() {
    }

    public AdminDeliveryUpdateRequest(String deliveryPersonName, String deliveryPersonPhone, DeliveryStatus status, LocalDateTime estimatedDeliveryTime, LocalDateTime actualDeliveryTime) {
        this.deliveryPersonName = deliveryPersonName;
        this.deliveryPersonPhone = deliveryPersonPhone;
        this.status = status;
        this.estimatedDeliveryTime = estimatedDeliveryTime;
        this.actualDeliveryTime = actualDeliveryTime;
    }

    public String getDeliveryPersonName() {
        return deliveryPersonName;
    }

    public void setDeliveryPersonName(String deliveryPersonName) {
        this.deliveryPersonName = deliveryPersonName;
    }

    public String getDeliveryPersonPhone() {
        return deliveryPersonPhone;
    }

    public void setDeliveryPersonPhone(String deliveryPersonPhone) {
        this.deliveryPersonPhone = deliveryPersonPhone;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public LocalDateTime getEstimatedDeliveryTime() {
        return estimatedDeliveryTime;
    }

    public void setEstimatedDeliveryTime(LocalDateTime estimatedDeliveryTime) {
        this.estimatedDeliveryTime = estimatedDeliveryTime;
    }

    public LocalDateTime getActualDeliveryTime() {
        return actualDeliveryTime;
    }

    public void setActualDeliveryTime(LocalDateTime actualDeliveryTime) {
        this.actualDeliveryTime = actualDeliveryTime;
    }
}

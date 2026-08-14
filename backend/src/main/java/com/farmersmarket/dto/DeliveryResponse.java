package com.farmersmarket.dto;

import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public class DeliveryResponse {

    private UUID id;
    private DeliveryStatus status;
    private String deliveryPersonName;
    private String deliveryPersonPhone;
    private LocalDateTime estimatedDeliveryTime;
    private LocalDateTime actualDeliveryTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DeliveryResponse() {
    }

    public static DeliveryResponse fromEntity(Delivery delivery) {
        if (delivery == null) return null;
        DeliveryResponse response = new DeliveryResponse();
        response.setId(delivery.getId());
        response.setStatus(delivery.getStatus());
        response.setDeliveryPersonName(delivery.getDeliveryPersonName());
        response.setDeliveryPersonPhone(delivery.getDeliveryPersonPhone());
        response.setEstimatedDeliveryTime(delivery.getEstimatedDeliveryTime());
        response.setActualDeliveryTime(delivery.getActualDeliveryTime());
        response.setCreatedAt(delivery.getCreatedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

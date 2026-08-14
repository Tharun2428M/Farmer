package com.farmersmarket.dto;

import com.farmersmarket.entity.Notification;
import com.farmersmarket.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationResponse {

    private UUID id;
    private String title;
    private String message;
    private Boolean isRead;
    private NotificationType type;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public static NotificationResponse fromEntity(Notification notification) {
        if (notification == null) return null;
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setIsRead(notification.getIsRead());
        response.setType(notification.getType());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

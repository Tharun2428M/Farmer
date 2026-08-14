package com.farmersmarket.service;

import com.farmersmarket.dto.NotificationResponse;
import com.farmersmarket.dto.UnreadCountResponse;
import com.farmersmarket.entity.Notification;
import com.farmersmarket.entity.NotificationType;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Create and persist a notification for a recipient user.
     */
    @Transactional
    public Notification sendNotification(User user, String title, String message, NotificationType type) {
        if (user == null) return null;
        Notification notification = new Notification(user, title, message, type);
        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for authenticated user.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(User user) {
        List<Notification> notifications = notificationRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notification count for badge counter.
     */
    @Transactional(readOnly = true)
    public UnreadCountResponse getUnreadCount(User user) {
        long count = notificationRepository.countByUser_IdAndIsReadFalse(user.getId());
        return new UnreadCountResponse(count);
    }

    /**
     * Mark single notification as read.
     */
    @Transactional
    public NotificationResponse markAsRead(User user, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to modify this notification.");
        }

        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(saved);
    }

    /**
     * Mark all notifications for authenticated user as read.
     */
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadByUserId(user.getId());
    }
}

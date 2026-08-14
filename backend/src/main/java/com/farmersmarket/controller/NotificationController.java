package com.farmersmarket.controller;

import com.farmersmarket.dto.NotificationResponse;
import com.farmersmarket.dto.UnreadCountResponse;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Autowired
    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    /**
     * Get all notifications for authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<NotificationResponse> list = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(list);
    }

    /**
     * Get count of unread notifications for badge.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        UnreadCountResponse count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(count);
    }

    /**
     * Mark single notification as read.
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            Authentication authentication,
            @PathVariable("id") UUID id) {
        User user = getAuthenticatedUser(authentication);
        NotificationResponse res = notificationService.markAsRead(user, id);
        return ResponseEntity.ok(res);
    }

    /**
     * Mark all notifications as read.
     */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}

package com.farmersmarket.service;

import com.farmersmarket.dto.AdminDeliveryUpdateRequest;
import com.farmersmarket.dto.DeliveryResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.entity.NotificationType;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminDeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Autowired
    public AdminDeliveryService(
            DeliveryRepository deliveryRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            NotificationService notificationService) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PageResponse<DeliveryResponse> getDeliveries(
            DeliveryStatus status,
            String query,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<Delivery> deliveryPage = deliveryRepository.findAdminDeliveriesWithFilters(status, cleanQuery, pageable);

        return new PageResponse<>(
                deliveryPage.getContent().stream().map(DeliveryResponse::fromEntity).collect(Collectors.toList()),
                deliveryPage.getNumber(),
                deliveryPage.getSize(),
                deliveryPage.getTotalElements(),
                deliveryPage.getTotalPages(),
                deliveryPage.isLast()
        );
    }

    @Transactional
    public DeliveryResponse updateDelivery(UUID id, AdminDeliveryUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery record with ID " + id + " not found."));

        if (request.getDeliveryPersonName() != null) {
            delivery.setDeliveryPersonName(request.getDeliveryPersonName().trim());
        }
        if (request.getDeliveryPersonPhone() != null) {
            delivery.setDeliveryPersonPhone(request.getDeliveryPersonPhone().trim());
        }
        if (request.getEstimatedDeliveryTime() != null) {
            delivery.setEstimatedDeliveryTime(request.getEstimatedDeliveryTime());
        }
        if (request.getActualDeliveryTime() != null) {
            delivery.setActualDeliveryTime(request.getActualDeliveryTime());
        }

        DeliveryStatus newStatus = request.getStatus();
        delivery.setStatus(newStatus);

        Order order = delivery.getOrder();
        if (newStatus == DeliveryStatus.DELIVERED) {
            if (delivery.getActualDeliveryTime() == null) {
                delivery.setActualDeliveryTime(LocalDateTime.now());
            }
            if (order != null) {
                order.setStatus(OrderStatus.DELIVERED);
                order.setPaymentStatus(OrderPaymentStatus.PAID);
                Payment payment = order.getPayment();
                if (payment != null) {
                    payment.setStatus(PaymentStatus.SUCCESS);
                    paymentRepository.save(payment);
                }
                orderRepository.save(order);
            }
        } else if (newStatus == DeliveryStatus.OUT_FOR_DELIVERY && order != null) {
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
            orderRepository.save(order);
        }

        Delivery saved = deliveryRepository.save(delivery);

        // Notify customer
        if (order != null && order.getCustomer() != null && order.getCustomer().getUser() != null) {
            NotificationType nType = NotificationType.GENERAL;
            if (newStatus == DeliveryStatus.DELIVERED) {
                nType = NotificationType.ORDER_DELIVERED;
            } else if (newStatus == DeliveryStatus.OUT_FOR_DELIVERY) {
                nType = NotificationType.OUT_FOR_DELIVERY;
            }

            notificationService.sendNotification(
                    order.getCustomer().getUser(),
                    "Delivery Update for Order #" + order.getId().toString().substring(0, 8),
                    "Your farm delivery status is now: " + newStatus.name() + (request.getDeliveryPersonName() != null ? " with driver " + request.getDeliveryPersonName() : ""),
                    nType
            );
        }

        return DeliveryResponse.fromEntity(saved);
    }
}

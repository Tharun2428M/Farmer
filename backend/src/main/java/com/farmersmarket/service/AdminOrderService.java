package com.farmersmarket.service;

import com.farmersmarket.dto.AdminOrderStatusUpdateRequest;
import com.farmersmarket.dto.OrderResponse;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final DeliveryRepository deliveryRepository;
    private final NotificationService notificationService;

    @Autowired
    public AdminOrderService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            DeliveryRepository deliveryRepository,
            NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.deliveryRepository = deliveryRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> getOrders(
            OrderStatus status,
            OrderPaymentStatus paymentStatus,
            LocalDateTime startDate,
            LocalDateTime endDate,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Order> orderPage = orderRepository.findAdminOrdersWithFilters(
                status,
                paymentStatus,
                startDate,
                endDate,
                pageable
        );

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID id) {
        Order order = orderRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + id + " not found."));
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID id, AdminOrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + id + " not found."));

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();
        order.setStatus(newStatus);

        // Synchronize delivery and payment status if delivered
        if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus(OrderPaymentStatus.PAID);
            Payment payment = order.getPayment();
            if (payment != null) {
                payment.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment);
            }

            Delivery delivery = order.getDelivery();
            if (delivery != null) {
                delivery.setStatus(DeliveryStatus.DELIVERED);
                delivery.setActualDeliveryTime(LocalDateTime.now());
                deliveryRepository.save(delivery);
            }
        } else if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
            Delivery delivery = order.getDelivery();
            if (delivery != null && delivery.getStatus() != DeliveryStatus.DELIVERED) {
                delivery.setStatus(DeliveryStatus.OUT_FOR_DELIVERY);
                deliveryRepository.save(delivery);
            }
        } else if (newStatus == OrderStatus.CANCELLED) {
            Delivery delivery = order.getDelivery();
            if (delivery != null) {
                delivery.setStatus(DeliveryStatus.FAILED);
                deliveryRepository.save(delivery);
            }
        }

        Order saved = orderRepository.save(order);

        // Notify customer
        if (order.getCustomer() != null && order.getCustomer().getUser() != null) {
            NotificationType nType = NotificationType.GENERAL;
            if (newStatus == OrderStatus.DELIVERED) {
                nType = NotificationType.ORDER_DELIVERED;
            } else if (newStatus == OrderStatus.CONFIRMED) {
                nType = NotificationType.ORDER_CONFIRMED;
            } else if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
                nType = NotificationType.OUT_FOR_DELIVERY;
            } else if (newStatus == OrderStatus.CANCELLED) {
                nType = NotificationType.ORDER_CANCELLED;
            }

            notificationService.sendNotification(
                    order.getCustomer().getUser(),
                    "Order #" + order.getId().toString().substring(0, 8) + " status updated",
                    "Your order status has been updated to " + newStatus.name() + " by system administration.",
                    nType
            );
        }

        return OrderResponse.fromEntity(saved);
    }
}

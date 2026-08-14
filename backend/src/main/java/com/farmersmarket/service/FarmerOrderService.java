package com.farmersmarket.service;

import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.NotificationType;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderItem;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FarmerOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final DeliveryRepository deliveryRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Autowired
    public FarmerOrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            FarmerProfileRepository farmerProfileRepository,
            DeliveryRepository deliveryRepository,
            PaymentRepository paymentRepository,
            NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.deliveryRepository = deliveryRepository;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    /**
     * Get orders that contain produce listed by the authenticated farmer.
     * Returns empty list if farmer has no profile or no orders yet.
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getFarmerOrders(User farmerUser) {
        Optional<FarmerProfile> farmerOpt = farmerProfileRepository.findById(farmerUser.getId());
        if (farmerOpt.isEmpty()) {
            return List.of();
        }

        FarmerProfile farmer = farmerOpt.get();
        List<Order> orders = orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId());
        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Update fulfillment status of an order.
     */
    @Transactional
    public OrderResponse updateOrderStatus(User farmerUser, UUID orderId, OrderStatus newStatus) {
        FarmerProfile farmer = farmerProfileRepository.findById(farmerUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for authenticated user."));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order with ID " + orderId + " was not found."));

        // Verify order contains at least one item from this farmer
        List<OrderItem> farmerItems = orderItemRepository.findByOrderIdAndFarmerId(orderId, farmer.getId());
        if (farmerItems.isEmpty()) {
            throw new AccessDeniedException("You do not have permission to update this order.");
        }

        // Validate status transition
        validateStatusTransition(order.getStatus(), newStatus);

        order.setStatus(newStatus);

        // Synchronize delivery record
        Optional<Delivery> deliveryOpt = deliveryRepository.findByOrder_Id(orderId);
        Delivery delivery = deliveryOpt.orElseGet(() -> new Delivery(order, DeliveryStatus.PENDING, LocalDateTime.now().plusDays(3)));

        if (newStatus == OrderStatus.PROCESSING) {
            delivery.setStatus(DeliveryStatus.ASSIGNED);
        } else if (newStatus == OrderStatus.OUT_FOR_DELIVERY) {
            delivery.setStatus(DeliveryStatus.OUT_FOR_DELIVERY);
        } else if (newStatus == OrderStatus.DELIVERED) {
            delivery.setStatus(DeliveryStatus.DELIVERED);
            delivery.setActualDeliveryTime(LocalDateTime.now());

            // For Cash on Delivery, mark as paid upon delivery
            if (order.getPayment() != null && order.getPayment().getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
                Payment payment = order.getPayment();
                payment.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment);
                order.setPaymentStatus(OrderPaymentStatus.PAID);
            }
        }
        deliveryRepository.save(delivery);
        order.setDelivery(delivery);

        Order saved = orderRepository.save(order);

        // Send status notification to Customer
        if (order.getCustomer() != null && order.getCustomer().getUser() != null) {
            String shortId = order.getId().toString().substring(0, 8).toUpperCase();
            NotificationType nType = NotificationType.ORDER_CONFIRMED;
            if (newStatus == OrderStatus.OUT_FOR_DELIVERY) nType = NotificationType.OUT_FOR_DELIVERY;
            if (newStatus == OrderStatus.DELIVERED) nType = NotificationType.ORDER_DELIVERED;

            notificationService.sendNotification(
                    order.getCustomer().getUser(),
                    "Order Update #" + shortId,
                    "Your farm produce order status is now: " + newStatus.name().replace('_', ' ') + ".",
                    nType
            );
        }

        return OrderResponse.fromEntity(saved);
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        if (current == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot update status of a cancelled order.");
        }
        if (current == OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Order has already been completed and delivered.");
        }

        if (current == OrderStatus.CONFIRMED && next != OrderStatus.PROCESSING && next != OrderStatus.OUT_FOR_DELIVERY) {
            throw new IllegalArgumentException("Confirmed order can only transition to PROCESSING or OUT_FOR_DELIVERY.");
        }

        if (current == OrderStatus.PROCESSING && next != OrderStatus.OUT_FOR_DELIVERY && next != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Processing order can only transition to OUT_FOR_DELIVERY or DELIVERED.");
        }

        if (current == OrderStatus.OUT_FOR_DELIVERY && next != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Out for delivery order can only transition to DELIVERED.");
        }
    }
}

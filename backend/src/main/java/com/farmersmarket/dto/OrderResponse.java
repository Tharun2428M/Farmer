package com.farmersmarket.dto;

import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class OrderResponse {

    private UUID id;
    private UUID customerId;
    private String customerName;
    private String customerPhone;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private OrderPaymentStatus paymentStatus;
    private AddressResponse deliveryAddress;
    private List<OrderItemResponse> items = new ArrayList<>();
    private int totalItems;
    private PaymentResponse payment;
    private DeliveryResponse delivery;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {
    }

    public static OrderResponse fromEntity(Order order) {
        if (order == null) return null;
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        if (order.getCustomer() != null) {
            response.setCustomerId(order.getCustomer().getId());
            response.setCustomerName(order.getCustomer().getFullName());
            response.setCustomerPhone(order.getCustomer().getPhoneNumber());
        }
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());

        if (order.getDeliveryAddress() != null) {
            response.setDeliveryAddress(AddressResponse.fromEntity(order.getDeliveryAddress()));
        }

        if (order.getItems() != null) {
            List<OrderItemResponse> itemDtos = order.getItems().stream()
                    .map(OrderItemResponse::fromEntity)
                    .collect(Collectors.toList());
            response.setItems(itemDtos);
            response.setTotalItems(itemDtos.stream().mapToInt(OrderItemResponse::getQuantity).sum());
        }

        if (order.getPayment() != null) {
            response.setPayment(PaymentResponse.fromEntity(order.getPayment()));
        }

        if (order.getDelivery() != null) {
            response.setDelivery(DeliveryResponse.fromEntity(order.getDelivery()));
        }

        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public OrderPaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(OrderPaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public AddressResponse getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(AddressResponse deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public PaymentResponse getPayment() {
        return payment;
    }

    public void setPayment(PaymentResponse payment) {
        this.payment = payment;
    }

    public DeliveryResponse getDelivery() {
        return delivery;
    }

    public void setDelivery(DeliveryResponse delivery) {
        this.delivery = delivery;
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

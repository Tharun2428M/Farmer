package com.farmersmarket.dto;

import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentResponse {

    private UUID id;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionReference;
    private LocalDateTime createdAt;

    public PaymentResponse() {
    }

    public static PaymentResponse fromEntity(Payment payment) {
        if (payment == null) return null;
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setAmount(payment.getAmount());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setStatus(payment.getStatus());
        response.setTransactionReference(payment.getTransactionReference());
        response.setCreatedAt(payment.getCreatedAt());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

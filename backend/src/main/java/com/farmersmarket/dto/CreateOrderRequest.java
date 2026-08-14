package com.farmersmarket.dto;

import com.farmersmarket.entity.PaymentMethod;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateOrderRequest {

    @NotNull(message = "Delivery address ID is required.")
    private UUID addressId;

    @NotNull(message = "Payment method is required.")
    private PaymentMethod paymentMethod;

    /**
     * For safe sandbox online payment testing.
     * Defaults to true if null. Set to false to simulate a failed online transaction.
     */
    private Boolean simulatePaymentSuccess = true;

    private String transactionReference;

    public CreateOrderRequest() {
    }

    public UUID getAddressId() {
        return addressId;
    }

    public void setAddressId(UUID addressId) {
        this.addressId = addressId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Boolean getSimulatePaymentSuccess() {
        return simulatePaymentSuccess != null ? simulatePaymentSuccess : true;
    }

    public void setSimulatePaymentSuccess(Boolean simulatePaymentSuccess) {
        this.simulatePaymentSuccess = simulatePaymentSuccess;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }
}

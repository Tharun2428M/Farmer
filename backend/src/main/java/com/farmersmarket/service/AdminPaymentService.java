package com.farmersmarket.service;

import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.dto.PaymentResponse;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminPaymentService {

    private final PaymentRepository paymentRepository;

    @Autowired
    public AdminPaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<PaymentResponse> getPayments(
            PaymentStatus status,
            PaymentMethod method,
            String query,
            int page,
            int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<Payment> paymentPage = paymentRepository.findAdminPaymentsWithFilters(
                status,
                method,
                cleanQuery,
                pageable
        );

        List<PaymentResponse> content = paymentPage.getContent().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                paymentPage.getNumber(),
                paymentPage.getSize(),
                paymentPage.getTotalElements(),
                paymentPage.getTotalPages(),
                paymentPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record with ID " + id + " not found."));
        return PaymentResponse.fromEntity(payment);
    }
}

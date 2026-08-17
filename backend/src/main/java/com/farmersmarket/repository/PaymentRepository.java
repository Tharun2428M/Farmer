package com.farmersmarket.repository;

import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findByOrder_Id(UUID orderId);

    long countByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p " +
           "LEFT JOIN FETCH p.order o " +
           "LEFT JOIN FETCH o.customer c " +
           "LEFT JOIN FETCH c.user u " +
           "WHERE (:status IS NULL OR p.status = :status) " +
           "AND (:method IS NULL OR p.paymentMethod = :method) " +
           "AND (:query IS NULL OR LOWER(p.transactionReference) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(p.id AS string) LIKE CONCAT('%', :query, '%'))")
    Page<Payment> findAdminPaymentsWithFilters(
            @Param("status") PaymentStatus status,
            @Param("method") PaymentMethod method,
            @Param("query") String query,
            Pageable pageable
    );

    List<Payment> findTop10ByOrderByCreatedAtDesc();
}


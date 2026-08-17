package com.farmersmarket.repository;

import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {

    List<Order> findByCustomer_IdOrderByCreatedAtDesc(UUID customerId);

    Optional<Order> findByIdAndCustomer_Id(UUID id, UUID customerId);

    long countByStatus(OrderStatus status);

    long countByPaymentStatus(OrderPaymentStatus paymentStatus);

    long countByCreatedAtAfter(LocalDateTime date);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != com.farmersmarket.entity.OrderStatus.CANCELLED")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != com.farmersmarket.entity.OrderStatus.CANCELLED AND o.createdAt >= :start")
    BigDecimal calculateRevenueSince(@Param("start") LocalDateTime start);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != com.farmersmarket.entity.OrderStatus.CANCELLED AND o.createdAt >= :start AND o.createdAt <= :end")
    BigDecimal calculateRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.farmer.id = :farmerId ORDER BY o.createdAt DESC")
    List<Order> findByFarmerIdOrderByCreatedAtDesc(@Param("farmerId") UUID farmerId);

    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.items i WHERE i.farmer.id = :farmerId")
    long countOrdersByFarmerId(@Param("farmerId") UUID farmerId);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.deliveryAddress a LEFT JOIN FETCH o.payment py LEFT JOIN FETCH o.delivery d WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.customer.id = :customerId AND i.product.id = :productId AND o.status = com.farmersmarket.entity.OrderStatus.DELIVERED")
    boolean hasCustomerDeliveredProduct(@Param("customerId") UUID customerId, @Param("productId") UUID productId);

    @Query("SELECT o FROM Order o " +
           "LEFT JOIN FETCH o.customer c " +
           "LEFT JOIN FETCH c.user u " +
           "LEFT JOIN FETCH o.deliveryAddress a " +
           "LEFT JOIN FETCH o.payment py " +
           "LEFT JOIN FETCH o.delivery d " +
           "WHERE (:status IS NULL OR o.status = :status) " +
           "AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) " +
           "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
    Page<Order> findAdminOrdersWithFilters(
            @Param("status") OrderStatus status,
            @Param("paymentStatus") OrderPaymentStatus paymentStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );

    List<Order> findTop10ByOrderByCreatedAtDesc();
}


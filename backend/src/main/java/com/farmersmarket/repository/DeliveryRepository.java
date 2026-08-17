package com.farmersmarket.repository;

import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
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
public interface DeliveryRepository extends JpaRepository<Delivery, UUID>, JpaSpecificationExecutor<Delivery> {

    Optional<Delivery> findByOrder_Id(UUID orderId);

    long countByStatus(DeliveryStatus status);

    @Query("SELECT d FROM Delivery d " +
           "LEFT JOIN FETCH d.order o " +
           "LEFT JOIN FETCH o.customer c " +
           "LEFT JOIN FETCH c.user u " +
           "LEFT JOIN FETCH o.deliveryAddress a " +
           "WHERE (:status IS NULL OR d.status = :status) " +
           "AND (:query IS NULL OR LOWER(d.deliveryPersonName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.deliveryPersonPhone) LIKE LOWER(CONCAT('%', :query, '%')) OR CAST(o.id AS string) LIKE CONCAT('%', :query, '%'))")
    Page<Delivery> findAdminDeliveriesWithFilters(
            @Param("status") DeliveryStatus status,
            @Param("query") String query,
            Pageable pageable
    );

    List<Delivery> findTop10ByOrderByCreatedAtDesc();
}


package com.farmersmarket.repository;

import com.farmersmarket.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByCustomer_IdOrderByCreatedAtDesc(UUID customerId);

    Optional<Order> findByIdAndCustomer_Id(UUID id, UUID customerId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.farmer.id = :farmerId ORDER BY o.createdAt DESC")
    List<Order> findByFarmerIdOrderByCreatedAtDesc(@Param("farmerId") UUID farmerId);

    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.deliveryAddress a LEFT JOIN FETCH o.payment py LEFT JOIN FETCH o.delivery d WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.customer.id = :customerId AND i.product.id = :productId AND o.status = com.farmersmarket.entity.OrderStatus.DELIVERED")
    boolean hasCustomerDeliveredProduct(@Param("customerId") UUID customerId, @Param("productId") UUID productId);
}

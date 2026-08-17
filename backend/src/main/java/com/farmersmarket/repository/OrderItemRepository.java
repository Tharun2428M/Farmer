package com.farmersmarket.repository;

import com.farmersmarket.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByOrder_Id(UUID orderId);

    long countByProduct_Id(UUID productId);

    @Query("SELECT i FROM OrderItem i LEFT JOIN FETCH i.product p LEFT JOIN FETCH i.farmer f LEFT JOIN FETCH f.user WHERE i.order.id = :orderId")
    List<OrderItem> findByOrderIdWithDetails(@Param("orderId") UUID orderId);

    @Query("SELECT i FROM OrderItem i LEFT JOIN FETCH i.product p WHERE i.order.id = :orderId AND i.farmer.id = :farmerId")
    List<OrderItem> findByOrderIdAndFarmerId(@Param("orderId") UUID orderId, @Param("farmerId") UUID farmerId);

    @Query("SELECT i.product.id, i.product.title, SUM(i.quantity), SUM(i.subtotal) " +
           "FROM OrderItem i " +
           "WHERE i.order.status != com.farmersmarket.entity.OrderStatus.CANCELLED " +
           "GROUP BY i.product.id, i.product.title " +
           "ORDER BY SUM(i.quantity) DESC")
    List<Object[]> findTopSellingProducts();

    @Query("SELECT i.farmer.id, SUM(i.subtotal), COUNT(DISTINCT i.order.id) " +
           "FROM OrderItem i " +
           "WHERE i.order.status != com.farmersmarket.entity.OrderStatus.CANCELLED " +
           "GROUP BY i.farmer.id " +
           "ORDER BY SUM(i.subtotal) DESC")
    List<Object[]> findTopFarmersBySales();
}


package com.farmersmarket.repository;

import com.farmersmarket.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    Optional<CartItem> findByCart_IdAndProduct_Id(UUID cartId, UUID productId);

    Optional<CartItem> findByIdAndCart_Customer_Id(UUID id, UUID customerId);

    void deleteByCart_Id(UUID cartId);

    @Query("SELECT i FROM CartItem i LEFT JOIN FETCH i.product p LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE i.cart.id = :cartId ORDER BY i.createdAt ASC")
    List<CartItem> findByCartIdWithDetails(@Param("cartId") UUID cartId);

    @Query("SELECT i FROM CartItem i LEFT JOIN FETCH i.product p LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE i.cart.customer.id = :customerId ORDER BY i.createdAt ASC")
    List<CartItem> findByCustomerIdWithDetails(@Param("customerId") UUID customerId);
}

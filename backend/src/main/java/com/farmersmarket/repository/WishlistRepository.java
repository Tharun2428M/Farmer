package com.farmersmarket.repository;

import com.farmersmarket.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    List<Wishlist> findByCustomer_IdOrderByCreatedAtDesc(UUID customerId);

    Optional<Wishlist> findByCustomer_IdAndProduct_Id(UUID customerId, UUID productId);

    boolean existsByCustomer_IdAndProduct_Id(UUID customerId, UUID productId);

    void deleteByCustomer_IdAndProduct_Id(UUID customerId, UUID productId);

    @Query("SELECT w FROM Wishlist w LEFT JOIN FETCH w.product p LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE w.customer.id = :customerId ORDER BY w.createdAt DESC")
    List<Wishlist> findByCustomerIdWithDetails(@Param("customerId") UUID customerId);
}

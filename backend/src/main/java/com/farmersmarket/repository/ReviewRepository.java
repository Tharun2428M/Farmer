package com.farmersmarket.repository;

import com.farmersmarket.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("SELECT r FROM Review r LEFT JOIN FETCH r.customer c LEFT JOIN FETCH r.product p WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    List<Review> findByProductIdWithDetails(@Param("productId") UUID productId);

    Optional<Review> findByProduct_IdAndCustomer_Id(UUID productId, UUID customerId);

    Optional<Review> findByIdAndCustomer_Id(UUID id, UUID customerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") UUID productId);

    long countByProduct_Id(UUID productId);
}

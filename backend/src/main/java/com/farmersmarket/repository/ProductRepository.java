package com.farmersmarket.repository;

import com.farmersmarket.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    List<Product> findByFarmer_IdOrderByCreatedAtDesc(UUID farmerId);

    Optional<Product> findByIdAndFarmer_Id(UUID id, UUID farmerId);

    long countByFarmer_Id(UUID farmerId);

    long countByFarmer_IdAndIsActiveTrue(UUID farmerId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE p.farmer.id = :farmerId ORDER BY p.createdAt DESC")
    List<Product> findByFarmerIdWithDetails(@Param("farmerId") UUID farmerId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE p.id = :productId")
    Optional<Product> findByIdWithDetails(@Param("productId") UUID productId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category LEFT JOIN FETCH p.inventory LEFT JOIN FETCH p.farmer f LEFT JOIN FETCH f.user WHERE p.id = :productId AND p.isActive = true")
    Optional<Product> findByIdAndIsActiveTrueWithDetails(@Param("productId") UUID productId);
}

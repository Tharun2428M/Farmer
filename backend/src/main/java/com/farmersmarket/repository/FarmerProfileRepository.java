package com.farmersmarket.repository;

import com.farmersmarket.entity.FarmerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, UUID>, JpaSpecificationExecutor<FarmerProfile> {

    Optional<FarmerProfile> findByFarmName(String farmName);

    boolean existsByFarmName(String farmName);

    @Query("SELECT f FROM FarmerProfile f LEFT JOIN FETCH f.user u WHERE f.id = :id")
    Optional<FarmerProfile> findByIdWithDetails(@Param("id") UUID id);

    @Query("SELECT f FROM FarmerProfile f " +
           "LEFT JOIN FETCH f.user u " +
           "WHERE (:query IS NULL OR LOWER(f.farmName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<FarmerProfile> findAdminFarmersWithFilters(
            @Param("query") String query,
            Pageable pageable
    );
}


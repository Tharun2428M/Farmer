package com.farmersmarket.repository;

import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(Role role);

    long countByRole(Role role);

    long countByStatus(String status);

    long countByCreatedAtAfter(OffsetDateTime date);

    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR LOWER(u.status) = LOWER(:status)) AND " +
           "(:query IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<User> findUsersWithFilters(
            @Param("role") Role role,
            @Param("status") String status,
            @Param("query") String query,
            Pageable pageable
    );
}


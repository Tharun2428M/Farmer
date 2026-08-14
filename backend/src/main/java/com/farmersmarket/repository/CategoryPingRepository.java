package com.farmersmarket.repository;

import com.farmersmarket.entity.CategoryPing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CategoryPingRepository extends JpaRepository<CategoryPing, UUID> {
}

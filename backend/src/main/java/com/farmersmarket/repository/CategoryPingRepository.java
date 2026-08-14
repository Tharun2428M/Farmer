package com.farmersmarket.repository;

import com.farmersmarket.entity.CategoryPing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryPingRepository extends JpaRepository<CategoryPing, Long> {
}


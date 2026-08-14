package com.farmersmarket.service;

import com.farmersmarket.repository.CategoryPingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JpaPingService {

    private final CategoryPingRepository categoryPingRepository;

    @Autowired
    public JpaPingService(CategoryPingRepository categoryPingRepository) {
        this.categoryPingRepository = categoryPingRepository;
    }

    public long getCategoryCount() {
        return categoryPingRepository.count();
    }
}

package com.farmersmarket.service;

import com.farmersmarket.dto.AdminCategoryRequest;
import com.farmersmarket.dto.CategoryDto;
import com.farmersmarket.entity.Category;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public AdminCategoryService(
            CategoryRepository categoryRepository,
            ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));
        return CategoryDto.fromEntity(category);
    }

    @Transactional
    public CategoryDto createCategory(AdminCategoryRequest request) {
        String trimmedName = request.getName().trim();
        if (categoryRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new IllegalArgumentException("A category with the name '" + trimmedName + "' already exists.");
        }

        Category category = new Category(
                trimmedName,
                request.getDescription() != null ? request.getDescription().trim() : null,
                request.getIconName() != null ? request.getIconName().trim() : null
        );

        Category saved = categoryRepository.save(category);
        return CategoryDto.fromEntity(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, AdminCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));

        String trimmedName = request.getName().trim();
        Optional<Category> existing = categoryRepository.findByNameIgnoreCase(trimmedName);
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Another category with the name '" + trimmedName + "' already exists.");
        }

        category.setName(trimmedName);
        category.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        category.setIconName(request.getIconName() != null ? request.getIconName().trim() : null);

        Category updated = categoryRepository.save(category);
        return CategoryDto.fromEntity(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with ID " + id + " not found."));

        long productCount = productRepository.countByCategory_Id(id);
        if (productCount > 0) {
            throw new IllegalArgumentException("Cannot delete category '" + category.getName() + "' because " + productCount + " product(s) currently depend on it. Reassign or remove the products first.");
        }

        categoryRepository.delete(category);
    }
}

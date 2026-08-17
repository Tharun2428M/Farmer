package com.farmersmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminCategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must be less than 100 characters")
    private String name;

    private String description;

    @Size(max = 50, message = "Icon name must be less than 50 characters")
    private String iconName;

    public AdminCategoryRequest() {
    }

    public AdminCategoryRequest(String name, String description, String iconName) {
        this.name = name;
        this.description = description;
        this.iconName = iconName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() {
        return iconName;
    }

    public void setIconName(String iconName) {
        this.iconName = iconName;
    }
}

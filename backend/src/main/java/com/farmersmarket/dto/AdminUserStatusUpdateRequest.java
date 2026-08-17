package com.farmersmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AdminUserStatusUpdateRequest {

    @NotBlank(message = "Status cannot be blank")
    @Pattern(regexp = "^(ACTIVE|INACTIVE|SUSPENDED)$", message = "Status must be ACTIVE, INACTIVE, or SUSPENDED")
    private String status;

    public AdminUserStatusUpdateRequest() {
    }

    public AdminUserStatusUpdateRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

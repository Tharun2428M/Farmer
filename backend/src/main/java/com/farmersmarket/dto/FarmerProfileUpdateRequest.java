package com.farmersmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class FarmerProfileUpdateRequest {

    @NotBlank(message = "Farm name is required")
    @Size(min = 2, max = 255, message = "Farm name must be between 2 and 255 characters")
    private String farmName;

    private String farmDescription;

    @NotBlank(message = "Farm address is required")
    private String farmAddress;

    private String phone;

    public FarmerProfileUpdateRequest() {
    }

    public FarmerProfileUpdateRequest(String farmName, String farmDescription, String farmAddress, String phone) {
        this.farmName = farmName;
        this.farmDescription = farmDescription;
        this.farmAddress = farmAddress;
        this.phone = phone;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getFarmDescription() {
        return farmDescription;
    }

    public void setFarmDescription(String farmDescription) {
        this.farmDescription = farmDescription;
    }

    public String getFarmAddress() {
        return farmAddress;
    }

    public void setFarmAddress(String farmAddress) {
        this.farmAddress = farmAddress;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}

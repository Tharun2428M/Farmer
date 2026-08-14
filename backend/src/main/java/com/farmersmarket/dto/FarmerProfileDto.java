package com.farmersmarket.dto;

import com.farmersmarket.entity.FarmerProfile;

import java.math.BigDecimal;
import java.util.UUID;

public class FarmerProfileDto {
    private UUID id;
    private String farmerName;
    private String email;
    private String phone;
    private String farmName;
    private String farmDescription;
    private String farmAddress;
    private BigDecimal rating;

    public FarmerProfileDto() {
    }

    public FarmerProfileDto(UUID id, String farmerName, String email, String phone, String farmName, String farmDescription, String farmAddress, BigDecimal rating) {
        this.id = id;
        this.farmerName = farmerName;
        this.email = email;
        this.phone = phone;
        this.farmName = farmName;
        this.farmDescription = farmDescription;
        this.farmAddress = farmAddress;
        this.rating = rating;
    }

    public static FarmerProfileDto fromEntity(FarmerProfile profile) {
        if (profile == null) return null;
        String name = profile.getUser() != null ? profile.getUser().getName() : null;
        String email = profile.getUser() != null ? profile.getUser().getEmail() : null;
        String phone = profile.getUser() != null ? profile.getUser().getPhone() : null;

        return new FarmerProfileDto(
                profile.getId(),
                name,
                email,
                phone,
                profile.getFarmName(),
                profile.getFarmDescription(),
                profile.getFarmAddress(),
                profile.getRating()
        );
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
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

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
}

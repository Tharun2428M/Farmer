package com.farmersmarket.service;

import com.farmersmarket.dto.FarmerProfileDto;
import com.farmersmarket.dto.FarmerProfileUpdateRequest;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.EmailAlreadyExistsException;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final UserRepository userRepository;

    @Autowired
    public FarmerProfileService(FarmerProfileRepository farmerProfileRepository, UserRepository userRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FarmerProfile getOrCreateFarmerProfileEntity(User user) {
        return farmerProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    String defaultFarmName = (user.getName() != null ? user.getName() : "Farmer") + "'s Agro Farm";
                    // If defaultFarmName is taken, append user ID snippet
                    if (farmerProfileRepository.existsByFarmName(defaultFarmName)) {
                        defaultFarmName = defaultFarmName + " (" + user.getId().toString().substring(0, 4) + ")";
                    }
                    User managedUser = userRepository.findById(user.getId()).orElse(user);
                    FarmerProfile newProfile = new FarmerProfile();
                    newProfile.setUser(managedUser);
                    newProfile.setFarmName(defaultFarmName);
                    newProfile.setFarmAddress(managedUser.getName() != null ? "Farm Outlet, Maharashtra" : "Farm Location");
                    newProfile.setFarmDescription("Fresh organic crops and natural harvest directly from our farm.");
                    newProfile.setRating(BigDecimal.valueOf(5.0));
                    return farmerProfileRepository.save(newProfile);
                });
    }

    @Transactional
    public FarmerProfileDto getProfileForUser(User user) {
        FarmerProfile profile = getOrCreateFarmerProfileEntity(user);
        return FarmerProfileDto.fromEntity(profile);
    }

    @Transactional
    public FarmerProfileDto updateProfile(User user, FarmerProfileUpdateRequest request) {
        FarmerProfile profile = getOrCreateFarmerProfileEntity(user);

        String trimmedFarmName = request.getFarmName().trim();
        Optional<FarmerProfile> existingFarm = farmerProfileRepository.findByFarmName(trimmedFarmName);
        if (existingFarm.isPresent() && !existingFarm.get().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Farm name '" + trimmedFarmName + "' is already in use by another grower.");
        }

        profile.setFarmName(trimmedFarmName);
        profile.setFarmAddress(request.getFarmAddress().trim());
        profile.setFarmDescription(request.getFarmDescription());

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
            userRepository.save(user);
        }

        FarmerProfile saved = farmerProfileRepository.save(profile);
        return FarmerProfileDto.fromEntity(saved);
    }
}

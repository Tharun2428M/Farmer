package com.farmersmarket.controller;

import com.farmersmarket.dto.FarmerProfileDto;
import com.farmersmarket.dto.FarmerProfileUpdateRequest;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.FarmerProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/farmer/profile")
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;
    private final UserRepository userRepository;

    @Autowired
    public FarmerProfileController(FarmerProfileService farmerProfileService, UserRepository userRepository) {
        this.farmerProfileService = farmerProfileService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    @GetMapping
    public ResponseEntity<FarmerProfileDto> getProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        FarmerProfileDto profile = farmerProfileService.getProfileForUser(user);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<FarmerProfileDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody FarmerProfileUpdateRequest request) {
        User user = getAuthenticatedUser(authentication);
        FarmerProfileDto updated = farmerProfileService.updateProfile(user, request);
        return ResponseEntity.ok(updated);
    }
}

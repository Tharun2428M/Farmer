package com.farmersmarket.controller;

import com.farmersmarket.dto.AddressRequest;
import com.farmersmarket.dto.AddressResponse;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/addresses")
@PreAuthorize("hasRole('CUSTOMER')")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    @Autowired
    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedCustomer(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated customer not found."));
    }

    @GetMapping
    public ResponseEntity<List<AddressResponse>> getAddresses(Authentication authentication) {
        User user = getAuthenticatedCustomer(authentication);
        List<AddressResponse> addresses = addressService.getCustomerAddresses(user);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddressById(Authentication authentication, @PathVariable("id") UUID id) {
        User user = getAuthenticatedCustomer(authentication);
        AddressResponse address = addressService.getAddressById(user, id);
        return ResponseEntity.ok(address);
    }

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request) {
        User user = getAuthenticatedCustomer(authentication);
        AddressResponse created = addressService.createAddress(user, request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddress(
            Authentication authentication,
            @PathVariable("id") UUID id,
            @Valid @RequestBody AddressRequest request) {
        User user = getAuthenticatedCustomer(authentication);
        AddressResponse updated = addressService.updateAddress(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable("id") UUID id) {
        User user = getAuthenticatedCustomer(authentication);
        addressService.deleteAddress(user, id);
        return ResponseEntity.noContent().build();
    }
}

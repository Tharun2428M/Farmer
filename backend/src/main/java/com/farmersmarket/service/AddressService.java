package com.farmersmarket.service;

import com.farmersmarket.dto.AddressRequest;
import com.farmersmarket.dto.AddressResponse;
import com.farmersmarket.entity.Address;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getCustomerAddresses(User user) {
        List<Address> addresses = addressRepository.findByUser_IdOrderByIsDefaultDescCreatedAtDesc(user.getId());
        return addresses.stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddressById(User user, UUID addressId) {
        Address address = getAddressEntity(user, addressId);
        return AddressResponse.fromEntity(address);
    }

    @Transactional(readOnly = true)
    public Address getAddressEntity(User user, UUID addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address with ID " + addressId + " was not found."));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this address.");
        }

        return address;
    }

    @Transactional
    public AddressResponse createAddress(User user, AddressRequest request) {
        boolean isFirst = addressRepository.findByUser_IdOrderByIsDefaultDescCreatedAtDesc(user.getId()).isEmpty();
        boolean makeDefault = isFirst || Boolean.TRUE.equals(request.getIsDefault());

        if (makeDefault) {
            clearPreviousDefault(user.getId());
        }

        Address address = new Address(
                user,
                request.getAddressLine1(),
                request.getAddressLine2(),
                request.getCity(),
                request.getState(),
                request.getPostalCode(),
                request.getCountry(),
                makeDefault
        );

        Address saved = addressRepository.save(address);
        return AddressResponse.fromEntity(saved);
    }

    @Transactional
    public AddressResponse updateAddress(User user, UUID addressId, AddressRequest request) {
        Address address = getAddressEntity(user, addressId);

        if (Boolean.TRUE.equals(request.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            clearPreviousDefault(user.getId());
            address.setIsDefault(true);
        } else if (Boolean.FALSE.equals(request.getIsDefault())) {
            address.setIsDefault(false);
        }

        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());
        if (request.getCountry() != null) {
            address.setCountry(request.getCountry());
        }

        Address updated = addressRepository.save(address);
        return AddressResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteAddress(User user, UUID addressId) {
        Address address = getAddressEntity(user, addressId);
        addressRepository.delete(address);
    }

    private void clearPreviousDefault(UUID userId) {
        Optional<Address> currentDefault = addressRepository.findByUser_IdAndIsDefaultTrue(userId);
        currentDefault.ifPresent(addr -> {
            addr.setIsDefault(false);
            addressRepository.save(addr);
        });
    }
}

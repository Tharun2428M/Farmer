package com.farmersmarket.service;

import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerProfileService {

    private final CustomerProfileRepository customerProfileRepository;
    private final UserRepository userRepository;

    @Autowired
    public CustomerProfileService(CustomerProfileRepository customerProfileRepository, UserRepository userRepository) {
        this.customerProfileRepository = customerProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CustomerProfile getOrCreateCustomerProfileEntity(User user) {
        return customerProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    User managedUser = userRepository.findById(user.getId()).orElse(user);
                    CustomerProfile profile = new CustomerProfile();
                    profile.setUser(managedUser);
                    profile.setFullName(managedUser.getName() != null ? managedUser.getName() : "Customer");
                    profile.setPhoneNumber(managedUser.getPhone());
                    return customerProfileRepository.save(profile);
                });
    }
}

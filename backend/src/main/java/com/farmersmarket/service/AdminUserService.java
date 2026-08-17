package com.farmersmarket.service;

import com.farmersmarket.dto.AdminUserDto;
import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;

    @Autowired
    public AdminUserService(
            UserRepository userRepository,
            CustomerProfileRepository customerProfileRepository,
            FarmerProfileRepository farmerProfileRepository) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.farmerProfileRepository = farmerProfileRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminUserDto> getUsers(Role role, String status, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        String cleanStatus = (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) ? status.trim() : null;

        Page<User> userPage = userRepository.findUsersWithFilters(role, cleanStatus, cleanQuery, pageable);

        List<AdminUserDto> content = userPage.getContent().stream()
                .map(this::enrichUserDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                userPage.getNumber(),
                userPage.getSize(),
                userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public AdminUserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found."));
        return enrichUserDto(user);
    }

    @Transactional
    public AdminUserDto updateUserStatus(UUID id, AdminUserStatusUpdateRequest request, User currentAdmin) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + id + " not found."));

        // Safeguard: Admin cannot deactivate themselves
        if (user.getId().equals(currentAdmin.getId()) && !"ACTIVE".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Administrators cannot deactivate or suspend their own account.");
        }

        // Safeguard: Cannot alter status of other admins unless active
        if (user.getRole() == Role.ADMIN && !user.getId().equals(currentAdmin.getId()) && !"ACTIVE".equalsIgnoreCase(request.getStatus())) {
            throw new IllegalArgumentException("Modifying status of other administrator accounts is restricted.");
        }

        user.setStatus(request.getStatus().toUpperCase());
        User savedUser = userRepository.save(user);
        return enrichUserDto(savedUser);
    }

    private AdminUserDto enrichUserDto(User user) {
        AdminUserDto dto = AdminUserDto.fromEntity(user);
        if (user.getRole() == Role.FARMER) {
            Optional<FarmerProfile> farmer = farmerProfileRepository.findById(user.getId());
            farmer.ifPresent(f -> {
                dto.setFarmName(f.getFarmName());
                dto.setFarmAddress(f.getFarmAddress());
            });
        } else if (user.getRole() == Role.CUSTOMER) {
            Optional<CustomerProfile> customer = customerProfileRepository.findById(user.getId());
            customer.ifPresent(c -> {
                dto.setCustomerFullName(c.getFullName());
            });
        }
        return dto;
    }
}

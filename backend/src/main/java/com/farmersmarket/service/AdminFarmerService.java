package com.farmersmarket.service;

import com.farmersmarket.dto.AdminFarmerDto;
import com.farmersmarket.dto.AdminProductDto;
import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.dto.OrderResponse;
import com.farmersmarket.dto.PageResponse;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.User;
import com.farmersmarket.exception.ResourceNotFoundException;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminFarmerService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdminFarmerService(
            FarmerProfileRepository farmerProfileRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {
        this.farmerProfileRepository = farmerProfileRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminFarmerDto> getFarmers(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        Page<FarmerProfile> farmerPage = farmerProfileRepository.findAdminFarmersWithFilters(cleanQuery, pageable);

        List<AdminFarmerDto> content = farmerPage.getContent().stream()
                .map(this::enrichFarmerDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                farmerPage.getNumber(),
                farmerPage.getSize(),
                farmerPage.getTotalElements(),
                farmerPage.getTotalPages(),
                farmerPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public AdminFarmerDto getFarmerById(UUID id) {
        FarmerProfile farmer = farmerProfileRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer with ID " + id + " not found."));
        return enrichFarmerDto(farmer);
    }

    @Transactional(readOnly = true)
    public List<AdminProductDto> getFarmerProducts(UUID farmerId) {
        if (!farmerProfileRepository.existsById(farmerId)) {
            throw new ResourceNotFoundException("Farmer with ID " + farmerId + " not found.");
        }
        List<Product> products = productRepository.findByFarmerIdWithDetails(farmerId);
        return products.stream()
                .map(AdminProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getFarmerOrders(UUID farmerId) {
        if (!farmerProfileRepository.existsById(farmerId)) {
            throw new ResourceNotFoundException("Farmer with ID " + farmerId + " not found.");
        }
        List<Order> orders = orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminFarmerDto updateFarmerStatus(UUID id, AdminUserStatusUpdateRequest request) {
        FarmerProfile farmer = farmerProfileRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer with ID " + id + " not found."));

        User user = farmer.getUser();
        if (user != null) {
            user.setStatus(request.getStatus().toUpperCase());
            userRepository.save(user);
        }
        return enrichFarmerDto(farmer);
    }

    private AdminFarmerDto enrichFarmerDto(FarmerProfile farmer) {
        AdminFarmerDto dto = AdminFarmerDto.fromEntity(farmer);
        long totalProducts = productRepository.countByFarmer_Id(farmer.getId());
        long activeProducts = productRepository.countByFarmer_IdAndIsActiveTrue(farmer.getId());
        long totalOrders = orderRepository.countOrdersByFarmerId(farmer.getId());

        dto.setTotalProducts(totalProducts);
        dto.setActiveProducts(activeProducts);
        dto.setTotalOrders(totalOrders);
        return dto;
    }
}

package com.farmersmarket.service;

import com.farmersmarket.dto.AdminDashboardStatsDto;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.entity.Role;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository customerProfileRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public AdminDashboardService(
            UserRepository userRepository,
            CustomerProfileRepository customerProfileRepository,
            FarmerProfileRepository farmerProfileRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.customerProfileRepository = customerProfileRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getDashboardStatistics() {
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalFarmers = userRepository.countByRole(Role.FARMER);

        long totalProducts = productRepository.count();
        long activeProducts = productRepository.countByIsActiveTrue();
        long outOfStockProducts = productRepository.countOutOfStock();
        long lowStockProducts = productRepository.countLowStock();

        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING) + orderRepository.countByStatus(OrderStatus.PROCESSING) + orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long completedOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderStatus.CANCELLED);

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long pendingPayments = paymentRepository.countByStatus(PaymentStatus.PENDING);
        long successfulPayments = paymentRepository.countByStatus(PaymentStatus.SUCCESS);

        return new AdminDashboardStatsDto(
                totalUsers,
                totalCustomers,
                totalFarmers,
                totalProducts,
                activeProducts,
                outOfStockProducts,
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                pendingPayments,
                successfulPayments,
                lowStockProducts
        );
    }
}

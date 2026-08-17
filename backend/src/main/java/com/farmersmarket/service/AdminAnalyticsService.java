package com.farmersmarket.service;

import com.farmersmarket.dto.AdminAnalyticsOverviewDto;
import com.farmersmarket.dto.AdminChartDataPointDto;
import com.farmersmarket.dto.AdminFarmerDto;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.Role;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CategoryRepository categoryRepository;
    private final FarmerProfileRepository farmerProfileRepository;

    @Autowired
    public AdminAnalyticsService(
            UserRepository userRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CategoryRepository categoryRepository,
            FarmerProfileRepository farmerProfileRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.categoryRepository = categoryRepository;
        this.farmerProfileRepository = farmerProfileRepository;
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsOverviewDto getAnalyticsOverview(String range, LocalDate customStart, LocalDate customEnd) {
        AdminAnalyticsOverviewDto dto = new AdminAnalyticsOverviewDto();

        // 1. User metrics
        dto.setTotalCustomers(userRepository.countByRole(Role.CUSTOMER));
        dto.setTotalFarmers(userRepository.countByRole(Role.FARMER));
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        dto.setNewUsersThisMonth(userRepository.countByCreatedAtAfter(firstDayOfMonth.atStartOfDay().atOffset(OffsetDateTime.now().getOffset())));
        dto.setActiveUsers(userRepository.countByStatus("ACTIVE"));

        // 2. Product metrics
        dto.setTotalProducts(productRepository.count());
        dto.setActiveProducts(productRepository.countByIsActiveTrue());
        dto.setLowStockProducts(productRepository.countLowStock());
        dto.setOutOfStockProducts(productRepository.countOutOfStock());

        // 3. Order metrics
        dto.setTotalOrders(orderRepository.count());
        dto.setCompletedOrders(orderRepository.countByStatus(OrderStatus.DELIVERED));
        dto.setPendingOrders(orderRepository.countByStatus(OrderStatus.PENDING) + orderRepository.countByStatus(OrderStatus.PROCESSING) + orderRepository.countByStatus(OrderStatus.CONFIRMED));
        dto.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED));

        // 4. Revenue metrics
        BigDecimal totalRev = orderRepository.calculateTotalRevenue();
        dto.setTotalRevenue(totalRev != null ? totalRev : BigDecimal.ZERO);

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        BigDecimal todayRev = orderRepository.calculateRevenueSince(startOfToday);
        dto.setTodayRevenue(todayRev != null ? todayRev : BigDecimal.ZERO);

        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        BigDecimal monthRev = orderRepository.calculateRevenueSince(startOfMonth);
        dto.setThisMonthRevenue(monthRev != null ? monthRev : BigDecimal.ZERO);

        if (dto.getCompletedOrders() > 0 && dto.getTotalRevenue().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal aov = dto.getTotalRevenue().divide(BigDecimal.valueOf(dto.getCompletedOrders()), 2, RoundingMode.HALF_UP);
            dto.setAverageOrderValue(aov);
        } else {
            dto.setAverageOrderValue(BigDecimal.ZERO);
        }

        // 5. Calculate date boundaries for charts
        int days = resolveDaysFromRange(range);
        LocalDate endDate = (customEnd != null) ? customEnd : LocalDate.now();
        LocalDate startDate = (customStart != null) ? customStart : endDate.minusDays(days - 1);

        dto.setOrdersOverTime(generateOrdersTimeSeries(startDate, endDate));
        dto.setRevenueOverTime(generateRevenueTimeSeries(startDate, endDate));
        dto.setCategoryDistribution(generateCategoryDistribution());
        dto.setOrderStatusDistribution(generateOrderStatusDistribution());
        dto.setTopSellingProducts(generateTopSellingProducts());
        dto.setTopFarmers(generateTopFarmers());

        return dto;
    }

    private int resolveDaysFromRange(String range) {
        if ("TODAY".equalsIgnoreCase(range) || "today".equalsIgnoreCase(range)) return 1;
        if ("30_DAYS".equalsIgnoreCase(range) || "30d".equalsIgnoreCase(range)) return 30;
        if ("THIS_MONTH".equalsIgnoreCase(range) || "month".equalsIgnoreCase(range)) return LocalDate.now().getDayOfMonth();
        return 7; // default 7 days
    }

    private List<AdminChartDataPointDto> generateOrdersTimeSeries(LocalDate start, LocalDate end) {
        List<AdminChartDataPointDto> list = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        LocalDate current = start;
        while (!current.isAfter(end)) {
            LocalDateTime dayStart = current.atStartOfDay();
            LocalDateTime dayEnd = current.atTime(LocalTime.MAX);

            long orderCount = orderRepository.countByCreatedAtBetween(dayStart, dayEnd);
            list.add(new AdminChartDataPointDto(current.format(formatter), orderCount));
            current = current.plusDays(1);
        }
        return list;
    }

    private List<AdminChartDataPointDto> generateRevenueTimeSeries(LocalDate start, LocalDate end) {
        List<AdminChartDataPointDto> list = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd");

        LocalDate current = start;
        while (!current.isAfter(end)) {
            LocalDateTime dayStart = current.atStartOfDay();
            LocalDateTime dayEnd = current.atTime(LocalTime.MAX);

            BigDecimal rev = orderRepository.calculateRevenueBetween(dayStart, dayEnd);
            list.add(new AdminChartDataPointDto(current.format(formatter), rev != null ? rev.doubleValue() : 0.0));
            current = current.plusDays(1);
        }
        return list;
    }

    private List<AdminChartDataPointDto> generateCategoryDistribution() {
        List<AdminChartDataPointDto> list = new ArrayList<>();
        List<Category> categories = categoryRepository.findAll();
        for (Category cat : categories) {
            long count = productRepository.countByCategory_Id(cat.getId());
            if (count > 0) {
                list.add(new AdminChartDataPointDto(cat.getName(), count));
            }
        }
        return list;
    }

    private List<AdminChartDataPointDto> generateOrderStatusDistribution() {
        List<AdminChartDataPointDto> list = new ArrayList<>();
        for (OrderStatus status : OrderStatus.values()) {
            long count = orderRepository.countByStatus(status);
            list.add(new AdminChartDataPointDto(status.name(), count));
        }
        return list;
    }

    private List<AdminChartDataPointDto> generateTopSellingProducts() {
        List<AdminChartDataPointDto> list = new ArrayList<>();
        List<Object[]> raw = orderItemRepository.findTopSellingProducts();
        int limit = Math.min(raw.size(), 8);
        for (int i = 0; i < limit; i++) {
            Object[] row = raw.get(i);
            String title = (String) row[1];
            Number totalQty = (Number) row[2];
            Number totalRev = (Number) row[3];
            list.add(new AdminChartDataPointDto(
                    title,
                    totalQty != null ? totalQty.doubleValue() : 0.0,
                    totalRev != null ? totalRev.doubleValue() : 0.0
            ));
        }
        return list;
    }

    private List<AdminFarmerDto> generateTopFarmers() {
        List<AdminFarmerDto> list = new ArrayList<>();
        List<Object[]> raw = orderItemRepository.findTopFarmersBySales();
        int limit = Math.min(raw.size(), 5);
        for (int i = 0; i < limit; i++) {
            Object[] row = raw.get(i);
            UUID farmerId = (UUID) row[0];
            farmerProfileRepository.findByIdWithDetails(farmerId).ifPresent(farmer -> {
                AdminFarmerDto dto = AdminFarmerDto.fromEntity(farmer);
                if (row[1] instanceof BigDecimal) {
                    dto.setTotalOrders(((Number) row[2]).longValue());
                }
                list.add(dto);
            });
        }
        return list;
    }
}

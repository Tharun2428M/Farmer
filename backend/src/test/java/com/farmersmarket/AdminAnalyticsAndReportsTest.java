package com.farmersmarket;

import com.farmersmarket.entity.Address;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Inventory;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderItem;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.AddressRepository;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.ReviewRepository;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminAnalyticsAndReportsTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private com.farmersmarket.service.FarmerProfileService farmerProfileService;

    @Autowired
    private com.farmersmarket.service.CustomerProfileService customerProfileService;

    @Autowired
    private com.farmersmarket.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.farmersmarket.repository.ReviewRepository reviewRepository;

    @Autowired
    private com.farmersmarket.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.farmersmarket.repository.CartItemRepository cartItemRepository;

    @Autowired
    private com.farmersmarket.repository.CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User adminUser;
    private String adminToken;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Admin
        adminUser = new User("Analytics Admin", "admin@farmersmarket.local", passwordEncoder.encode("Pass123!"), "9998887770", Role.ADMIN);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtService.generateToken(adminUser);

        // 2. Farmer
        User farmerUser = new User("Highland Farmer", "farmer@example.com", passwordEncoder.encode("Pass123!"), "9998887771", Role.FARMER);
        farmerUser = userRepository.save(farmerUser);
        FarmerProfile farmerProfile = farmerProfileService.getOrCreateFarmerProfileEntity(farmerUser);
        farmerProfile.setFarmName("Highland Organic Farms");
        farmerProfile = farmerProfileRepository.save(farmerProfile);

        // 3. Category & Product
        Category category = new Category("Greens", "Leafy fresh greens", "Leaf");
        category = categoryRepository.save(category);

        Product product = new Product(farmerProfile, category, "Organic Spinach", "Fresh spinach leaves", new BigDecimal("30.00"), "bundle", "https://example.com/spinach.jpg");
        product = productRepository.save(product);
        Inventory inventory = new Inventory(product, 20, 5);
        inventoryRepository.save(inventory);

        // 4. Customer
        User customerUser = new User("Jane Customer", "jane@example.com", passwordEncoder.encode("Pass123!"), "9998887772", Role.CUSTOMER);
        customerUser = userRepository.save(customerUser);
        CustomerProfile customerProfile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);

        Address address = new Address(customerUser, "10 Anna Salai", null, "Chennai", "Tamil Nadu", "600002", "India", true);
        address = addressRepository.save(address);

        // 5. Order
        Order order = new Order(customerProfile, new BigDecimal("60.00"), address);
        testOrderPersistence(order, product, farmerProfile);
    }

    private void testOrderPersistence(Order order, Product product, FarmerProfile farmerProfile) {
        order.setStatus(com.farmersmarket.entity.OrderStatus.DELIVERED);
        order.setPaymentStatus(com.farmersmarket.entity.OrderPaymentStatus.PAID);
        order = orderRepository.save(order);

        OrderItem item = new OrderItem(order, product, farmerProfile, 2, new BigDecimal("30.00"), new BigDecimal("60.00"));
        orderItemRepository.save(item);

        Payment payment = new Payment(order, new BigDecimal("60.00"), PaymentMethod.UPI, PaymentStatus.SUCCESS, "UPI-TEST-12345");
        paymentRepository.save(payment);

        Delivery delivery = new Delivery(order, DeliveryStatus.DELIVERED, LocalDateTime.now());
        deliveryRepository.save(delivery);
    }

    @org.junit.jupiter.api.AfterEach
    void tearDown() {
        cleanDatabase();
    }

    private void cleanDatabase() {
        if (notificationRepository != null) notificationRepository.deleteAll();
        if (reviewRepository != null) reviewRepository.deleteAll();
        if (orderItemRepository != null) orderItemRepository.deleteAll();
        if (deliveryRepository != null) deliveryRepository.deleteAll();
        if (paymentRepository != null) paymentRepository.deleteAll();
        if (orderRepository != null) orderRepository.deleteAll();
        if (wishlistRepository != null) wishlistRepository.deleteAll();
        if (cartItemRepository != null) cartItemRepository.deleteAll();
        if (cartRepository != null) cartRepository.deleteAll();
        if (addressRepository != null) addressRepository.deleteAll();
        if (inventoryRepository != null) inventoryRepository.deleteAll();
        if (productRepository != null) productRepository.deleteAll();
        if (categoryRepository != null) categoryRepository.deleteAll();
        if (customerProfileRepository != null) customerProfileRepository.deleteAll();
        if (farmerProfileRepository != null) farmerProfileRepository.deleteAll();
        if (userRepository != null) userRepository.deleteAll();
    }

    @Test
    @DisplayName("1. Admin Analytics Overview calculates users, products, orders, and time series")
    void testAnalyticsOverview() throws Exception {
        mockMvc.perform(get("/api/admin/analytics/overview?range=7_DAYS")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCustomers", is(1)))
                .andExpect(jsonPath("$.totalFarmers", is(1)))
                .andExpect(jsonPath("$.totalProducts", is(1)))
                .andExpect(jsonPath("$.totalOrders", is(1)))
                .andExpect(jsonPath("$.totalRevenue", is(60.0)))
                .andExpect(jsonPath("$.ordersOverTime").isArray())
                .andExpect(jsonPath("$.revenueOverTime").isArray())
                .andExpect(jsonPath("$.categoryDistribution").isArray())
                .andExpect(jsonPath("$.orderStatusDistribution").isArray())
                .andExpect(jsonPath("$.topSellingProducts").isArray());
    }

    @Test
    @DisplayName("2. Admin Reports CSV Exports return valid downloadable CSV format")
    void testReportsCsvExports() throws Exception {
        // Orders CSV
        mockMvc.perform(get("/api/admin/reports/export/orders")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=farmers_market_orders_report.csv"))
                .andExpect(content().contentType("text/csv; charset=UTF-8"));

        // Products CSV
        mockMvc.perform(get("/api/admin/reports/export/products")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=farmers_market_products_report.csv"));

        // Farmers CSV
        mockMvc.perform(get("/api/admin/reports/export/farmers")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=farmers_market_farmers_report.csv"));

        // Customers CSV
        mockMvc.perform(get("/api/admin/reports/export/customers")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=farmers_market_customers_report.csv"));
    }

    @Test
    @DisplayName("3. Admin System Health endpoint returns real status and diagnostic metrics")
    void testSystemHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/admin/system/health")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.databaseStatus", is("CONNECTED")))
                .andExpect(jsonPath("$.jvmTotalMemoryMb", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.appVersion", is("1.0.0")));
    }
}

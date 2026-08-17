package com.farmersmarket;

import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.security.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminSecurityAndAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private com.farmersmarket.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.farmersmarket.repository.ReviewRepository reviewRepository;

    @Autowired
    private com.farmersmarket.repository.OrderItemRepository orderItemRepository;

    @Autowired
    private com.farmersmarket.repository.DeliveryRepository deliveryRepository;

    @Autowired
    private com.farmersmarket.repository.PaymentRepository paymentRepository;

    @Autowired
    private com.farmersmarket.repository.OrderRepository orderRepository;

    @Autowired
    private com.farmersmarket.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.farmersmarket.repository.CartItemRepository cartItemRepository;

    @Autowired
    private com.farmersmarket.repository.CartRepository cartRepository;

    @Autowired
    private com.farmersmarket.repository.AddressRepository addressRepository;

    @Autowired
    private com.farmersmarket.repository.InventoryRepository inventoryRepository;

    @Autowired
    private com.farmersmarket.repository.ProductRepository productRepository;

    @Autowired
    private com.farmersmarket.repository.CategoryRepository categoryRepository;

    @Autowired
    private com.farmersmarket.repository.CustomerProfileRepository customerProfileRepository;

    @Autowired
    private com.farmersmarket.repository.FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User adminUser;
    private String adminToken;
    private String customerToken;
    private String farmerToken;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Create Admin
        adminUser = new User("System Admin", "admin@farmersmarket.local", passwordEncoder.encode("AdminPass123!"), "9990001111", Role.ADMIN);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtService.generateToken(adminUser);

        // 2. Create Customer
        User customer = new User("Customer User", "cust@example.com", passwordEncoder.encode("CustPass123!"), "9990002222", Role.CUSTOMER);
        customer = userRepository.save(customer);
        customerToken = jwtService.generateToken(customer);

        // 3. Create Farmer
        User farmer = new User("Farmer User", "farmer@example.com", passwordEncoder.encode("FarmerPass123!"), "9990003333", Role.FARMER);
        farmer = userRepository.save(farmer);
        farmerToken = jwtService.generateToken(farmer);
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
    @DisplayName("1. Unauthenticated requests to /api/admin/** return 401 Unauthorized")
    void testUnauthenticatedAdminAccess() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));

        mockMvc.perform(get("/api/admin/analytics/overview"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("2. CUSTOMER role requesting /api/admin/** endpoints returns 403 Forbidden")
    void testCustomerForbiddenFromAdminApis() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/farmers")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/products")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/orders")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/analytics/overview")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("3. FARMER role requesting /api/admin/** endpoints returns 403 Forbidden")
    void testFarmerForbiddenFromAdminApis() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/payments")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/deliveries")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/admin/system/health")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("4. ADMIN role successfully accesses /api/admin/dashboard with 200 OK")
    void testAdminAccessSuccess() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").exists())
                .andExpect(jsonPath("$.totalCustomers").exists())
                .andExpect(jsonPath("$.totalFarmers").exists());
    }

    @Test
    @DisplayName("5. Admin cannot accidentally deactivate or suspend own account")
    void testAdminSelfDeactivationBlocked() throws Exception {
        AdminUserStatusUpdateRequest req = new AdminUserStatusUpdateRequest("SUSPENDED");

        mockMvc.perform(put("/api/admin/users/" + adminUser.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Administrators cannot deactivate or suspend their own account.")));
    }
}

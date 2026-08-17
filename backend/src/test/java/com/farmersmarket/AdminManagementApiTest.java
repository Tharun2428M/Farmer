package com.farmersmarket;

import com.farmersmarket.dto.AdminCategoryRequest;
import com.farmersmarket.dto.AdminDeliveryUpdateRequest;
import com.farmersmarket.dto.AdminOrderStatusUpdateRequest;
import com.farmersmarket.dto.AdminUserStatusUpdateRequest;
import com.farmersmarket.entity.Address;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Delivery;
import com.farmersmarket.entity.DeliveryStatus;
import com.farmersmarket.entity.FarmerProfile;
import com.farmersmarket.entity.Inventory;
import com.farmersmarket.entity.Order;
import com.farmersmarket.entity.OrderItem;
import com.farmersmarket.entity.OrderPaymentStatus;
import com.farmersmarket.entity.OrderStatus;
import com.farmersmarket.entity.Payment;
import com.farmersmarket.entity.PaymentMethod;
import com.farmersmarket.entity.PaymentStatus;
import com.farmersmarket.entity.Product;
import com.farmersmarket.entity.Review;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminManagementApiTest {

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
    private ReviewRepository reviewRepository;

    @Autowired
    private com.farmersmarket.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.farmersmarket.repository.WishlistRepository wishlistRepository;

    @Autowired
    private com.farmersmarket.repository.CartItemRepository cartItemRepository;

    @Autowired
    private com.farmersmarket.repository.CartRepository cartRepository;

    @Autowired
    private com.farmersmarket.service.FarmerProfileService farmerProfileService;

    @Autowired
    private com.farmersmarket.service.CustomerProfileService customerProfileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User adminUser;
    private String adminToken;
    private User customerUser;
    private User farmerUser;
    private FarmerProfile farmerProfile;
    private CustomerProfile customerProfile;
    private Category testCategory;
    private Product testProduct;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Admin
        adminUser = new User("Admin Master", "admin@farmersmarket.local", passwordEncoder.encode("Pass123!"), "9998887770", Role.ADMIN);
        adminUser = userRepository.save(adminUser);
        adminToken = jwtService.generateToken(adminUser);

        // 2. Farmer
        farmerUser = new User("Green Valley Farmer", "farmer@example.com", passwordEncoder.encode("Pass123!"), "9998887771", Role.FARMER);
        farmerUser = userRepository.save(farmerUser);
        farmerProfile = farmerProfileService.getOrCreateFarmerProfileEntity(farmerUser);
        farmerProfile.setFarmName("Green Valley Organic Farm");
        farmerProfile = farmerProfileRepository.save(farmerProfile);

        // 3. Category
        testCategory = new Category("Fresh Vegetables", "Farm-fresh organic vegetables", "Carrot");
        testCategory = categoryRepository.save(testCategory);

        // 4. Product & Inventory
        testProduct = new Product(farmerProfile, testCategory, "Organic Crisp Carrots", "Crisp carrots", new BigDecimal("45.00"), "kg", "https://example.com/carrots.jpg");
        testProduct = productRepository.save(testProduct);
        Inventory inventory = new Inventory(testProduct, 50, 5);
        inventory = inventoryRepository.save(inventory);
        testProduct.setInventory(inventory);

        // 5. Customer & Address
        customerUser = new User("John Customer", "john@example.com", passwordEncoder.encode("Pass123!"), "9998887772", Role.CUSTOMER);
        customerUser = userRepository.save(customerUser);
        customerProfile = customerProfileService.getOrCreateCustomerProfileEntity(customerUser);

        Address address = new Address(customerUser, "42 Market Street", "Flat 3B", "Coimbatore", "Tamil Nadu", "641001", "India", true);
        address = addressRepository.save(address);

        // 6. Order, Items, Payment, Delivery
        testOrder = new Order(customerProfile, new BigDecimal("90.00"), address);
        testOrder = orderRepository.save(testOrder);

        OrderItem orderItem = new OrderItem(testOrder, testProduct, farmerProfile, 2, new BigDecimal("45.00"), new BigDecimal("90.00"));
        orderItemRepository.save(orderItem);

        Payment payment = new Payment(testOrder, new BigDecimal("90.00"), PaymentMethod.CASH_ON_DELIVERY, PaymentStatus.PENDING, "COD-" + UUID.randomUUID().toString().substring(0, 8));
        paymentRepository.save(payment);

        Delivery delivery = new Delivery(testOrder, DeliveryStatus.PENDING, LocalDateTime.now().plusDays(1));
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
    @DisplayName("1. Admin can list users with pagination, role filter, and search")
    void testAdminUserManagement() throws Exception {
        mockMvc.perform(get("/api/admin/users?role=FARMER")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].email", is("farmer@example.com")))
                .andExpect(jsonPath("$.content[0].farmName", is("Green Valley Organic Farm")));

        // Update customer status to SUSPENDED
        AdminUserStatusUpdateRequest statusReq = new AdminUserStatusUpdateRequest("SUSPENDED");
        mockMvc.perform(put("/api/admin/users/" + customerUser.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SUSPENDED")));

        User updatedCustomer = userRepository.findById(customerUser.getId()).orElseThrow();
        assertEquals("SUSPENDED", updatedCustomer.getStatus());
    }

    @Test
    @DisplayName("2. Admin can list farmers, view farmer details, products and orders")
    void testAdminFarmerManagement() throws Exception {
        mockMvc.perform(get("/api/admin/farmers")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].farmName", is("Green Valley Organic Farm")))
                .andExpect(jsonPath("$.content[0].totalProducts", greaterThanOrEqualTo(1)));

        mockMvc.perform(get("/api/admin/farmers/" + farmerProfile.getId() + "/products")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Organic Crisp Carrots")));

        mockMvc.perform(get("/api/admin/farmers/" + farmerProfile.getId() + "/orders")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("3. Admin can view all products, filter, deactivate and delete")
    void testAdminProductManagement() throws Exception {
        mockMvc.perform(get("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Organic Crisp Carrots")));

        // Toggle active status to false
        mockMvc.perform(put("/api/admin/products/" + testProduct.getId() + "/status?isActive=false")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isActive", is(false)));

        Product deactivated = productRepository.findById(testProduct.getId()).orElseThrow();
        assertFalse(deactivated.getIsActive());
    }

    @Test
    @DisplayName("4. Admin Category CRUD: create category, prevent duplicates, and safe delete validation")
    void testAdminCategoryManagement() throws Exception {
        // Create new category
        AdminCategoryRequest newCat = new AdminCategoryRequest("Fresh Fruits", "Seasonal and tropical fruits", "Apple");
        mockMvc.perform(post("/api/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCat)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Fresh Fruits")));

        // Duplicate name attempt -> 400 Bad Request
        mockMvc.perform(post("/api/admin/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newCat)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("A category with the name 'Fresh Fruits' already exists.")));

        // Safe delete test: category with existing product cannot be deleted
        mockMvc.perform(delete("/api/admin/categories/" + testCategory.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("5. Admin Order and Delivery Management with automated status synchronization")
    void testAdminOrderAndDeliveryManagement() throws Exception {
        // List admin orders
        mockMvc.perform(get("/api/admin/orders")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

        // Update delivery agent
        Delivery delivery = deliveryRepository.findByOrder_Id(testOrder.getId()).orElseThrow();
        AdminDeliveryUpdateRequest deliveryReq = new AdminDeliveryUpdateRequest(
                "Ramesh Delivery",
                "9876543210",
                DeliveryStatus.OUT_FOR_DELIVERY,
                LocalDateTime.now().plusHours(3),
                null
        );

        mockMvc.perform(put("/api/admin/deliveries/" + delivery.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deliveryReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deliveryPersonName", is("Ramesh Delivery")))
                .andExpect(jsonPath("$.status", is("OUT_FOR_DELIVERY")));

        // Update order status to DELIVERED -> synchronizes payment to PAID and delivery to DELIVERED
        AdminOrderStatusUpdateRequest orderReq = new AdminOrderStatusUpdateRequest(OrderStatus.DELIVERED);
        mockMvc.perform(put("/api/admin/orders/" + testOrder.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("DELIVERED")))
                .andExpect(jsonPath("$.paymentStatus", is("PAID")));

        Order updatedOrder = orderRepository.findById(testOrder.getId()).orElseThrow();
        assertEquals(OrderStatus.DELIVERED, updatedOrder.getStatus());
        assertEquals(OrderPaymentStatus.PAID, updatedOrder.getPaymentStatus());
    }

    @Test
    @DisplayName("6. Admin Review moderation and deletion")
    void testAdminReviewModeration() throws Exception {
        Review review = new Review(testProduct, customerProfile, 5, "Outstanding fresh carrots!");
        review = reviewRepository.save(review);

        mockMvc.perform(get("/api/admin/reviews")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].comment", is("Outstanding fresh carrots!")));

        mockMvc.perform(delete("/api/admin/reviews/" + review.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SUCCESS")));

        assertTrue(reviewRepository.findById(review.getId()).isEmpty());
    }
}

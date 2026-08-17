package com.farmersmarket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.farmersmarket.dto.LoginRequest;
import com.farmersmarket.dto.RegisterRequest;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.NotificationRepository notificationRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.ReviewRepository reviewRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.OrderItemRepository orderItemRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.DeliveryRepository deliveryRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.PaymentRepository paymentRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.OrderRepository orderRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.WishlistRepository wishlistRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CartItemRepository cartItemRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CartRepository cartRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.AddressRepository addressRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.FarmerProfileRepository farmerProfileRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CustomerProfileRepository customerProfileRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.ProductRepository productRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.InventoryRepository inventoryRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        cleanDatabase();
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
    @DisplayName("1. Register valid Customer returns 201 Created and JWT token")
    void testRegisterValidCustomer() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john.doe@example.com",
                "Password123",
                "9876543210",
                Role.CUSTOMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.name", is("John Doe")))
                .andExpect(jsonPath("$.user.email", is("john.doe@example.com")))
                .andExpect(jsonPath("$.user.role", is("CUSTOMER")))
                .andExpect(jsonPath("$.user.password").doesNotExist());

        // Verify password is stored as BCrypt hash in database
        User savedUser = userRepository.findByEmail("john.doe@example.com").orElse(null);
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getPassword()).isNotEqualTo("Password123");
        assertThat(passwordEncoder.matches("Password123", savedUser.getPassword())).isTrue();
    }

    @Test
    @DisplayName("2. Register valid Farmer returns 201 Created and FARMER role")
    void testRegisterValidFarmer() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Farmer Ramesh",
                "ramesh.farmer@example.com",
                "FarmSecurePass123",
                "9123456789",
                Role.FARMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.role", is("FARMER")));
    }

    @Test
    @DisplayName("3. Attempting to register as ADMIN is rejected with 400 Bad Request")
    void testRegisterAdminRejected() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Malicious User",
                "fake.admin@example.com",
                "SecretPass123",
                "9999999999",
                Role.ADMIN
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("BAD_REQUEST")));
    }

    @Test
    @DisplayName("4. Attempting to register duplicate email returns 409 Conflict")
    void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest request1 = new RegisterRequest(
                "User One",
                "duplicate@example.com",
                "Password123",
                "9876543210",
                Role.CUSTOMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        RegisterRequest request2 = new RegisterRequest(
                "User Two",
                "duplicate@example.com",
                "Password123",
                "9876543211",
                Role.CUSTOMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is("CONFLICT")));
    }

    @Test
    @DisplayName("5. Attempting to register with invalid email returns 400 Bad Request")
    void testRegisterInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Invalid Email User",
                "not-an-email",
                "Password123",
                "9876543210",
                Role.CUSTOMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("VALIDATION_ERROR")));
    }

    @Test
    @DisplayName("6. Attempting to register with weak password returns 400 Bad Request")
    void testRegisterWeakPassword() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Weak Password User",
                "weak@example.com",
                "123", // less than 6 chars
                "9876543210",
                Role.CUSTOMER
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("VALIDATION_ERROR")));
    }

    @Test
    @DisplayName("7. Login with valid credentials returns 200 OK and JWT token")
    void testLoginSuccess() throws Exception {
        // Register customer first
        RegisterRequest registerReq = new RegisterRequest(
                "Jane Doe",
                "jane.doe@example.com",
                "Password123",
                "9876543210",
                Role.CUSTOMER
        );
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        // Perform login
        LoginRequest loginReq = new LoginRequest("jane.doe@example.com", "Password123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.email", is("jane.doe@example.com")))
                .andExpect(jsonPath("$.user.role", is("CUSTOMER")));
    }

    @Test
    @DisplayName("8. Login with incorrect password returns 401 Unauthorized")
    void testLoginIncorrectPassword() throws Exception {
        RegisterRequest registerReq = new RegisterRequest(
                "Test User",
                "test.login@example.com",
                "CorrectPassword123",
                "9876543210",
                Role.CUSTOMER
        );
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = new LoginRequest("test.login@example.com", "WrongPassword999");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("9. Login with nonexistent email returns 401 Unauthorized")
    void testLoginNonexistentEmail() throws Exception {
        LoginRequest loginReq = new LoginRequest("nonexistent@example.com", "Password123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));
    }
}

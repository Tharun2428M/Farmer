package com.farmersmarket;

import com.farmersmarket.dto.FarmerProfileUpdateRequest;
import com.farmersmarket.dto.InventoryUpdateRequest;
import com.farmersmarket.dto.ProductCreateRequest;
import com.farmersmarket.dto.ProductUpdateRequest;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class FarmerModuleSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private User farmerA;
    private String farmerAToken;

    private User farmerB;
    private String farmerBToken;

    private User customer;
    private String customerToken;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Create Categories
        testCategory = categoryRepository.save(new Category("Fresh Vegetables", "Farm fresh greens", "Carrot"));
        categoryRepository.save(new Category("Organic Fruits", "Tree ripened fruits", "Apple"));

        // 2. Create Farmer A
        farmerA = new User("Farmer Ramesh", "ramesh@farmers.local", passwordEncoder.encode("Pass123!"), "9876543210", Role.FARMER);
        farmerA = userRepository.save(farmerA);
        farmerAToken = jwtService.generateToken(farmerA);

        // 3. Create Farmer B
        farmerB = new User("Farmer Suresh", "suresh@farmers.local", passwordEncoder.encode("Pass123!"), "9876543211", Role.FARMER);
        farmerB = userRepository.save(farmerB);
        farmerBToken = jwtService.generateToken(farmerB);

        // 4. Create Customer
        customer = new User("Customer Priya", "priya@customer.local", passwordEncoder.encode("Pass123!"), "9876543212", Role.CUSTOMER);
        customer = userRepository.save(customer);
        customerToken = jwtService.generateToken(customer);
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    private void cleanDatabase() {
        inventoryRepository.deleteAll();
        productRepository.deleteAll();
        farmerProfileRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("1. Public Category Listing works without authentication")
    void testPublicCategoryListing() throws Exception {
        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", notNullValue()));
    }

    @Test
    @DisplayName("2. Farmer can retrieve and update farm profile")
    void testFarmerProfileManagement() throws Exception {
        // Get Profile
        mockMvc.perform(get("/api/farmer/profile")
                        .header("Authorization", "Bearer " + farmerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.farmerName", is("Farmer Ramesh")))
                .andExpect(jsonPath("$.farmName", notNullValue()));

        // Update Profile
        FarmerProfileUpdateRequest updateRequest = new FarmerProfileUpdateRequest(
                "Ramesh Organic Valley Farms",
                "Leading supplier of organic vine crops in Pune.",
                "Plot 42, Agro Growth Cluster, Pune",
                "9876543219"
        );

        mockMvc.perform(put("/api/farmer/profile")
                        .header("Authorization", "Bearer " + farmerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.farmName", is("Ramesh Organic Valley Farms")))
                .andExpect(jsonPath("$.farmAddress", is("Plot 42, Agro Growth Cluster, Pune")));
    }

    @Test
    @DisplayName("3. Farmer A can create agricultural product with inventory")
    void testFarmerCreateProduct() throws Exception {
        ProductCreateRequest request = new ProductCreateRequest(
                "Fresh Hydroponic Spinach",
                "Crisp green leaves picked at 5am",
                testCategory.getId(),
                BigDecimal.valueOf(35.00),
                "bunch",
                100,
                10,
                "https://images.unsplash.com/photo-1576045057995"
        );

        mockMvc.perform(post("/api/farmer/products")
                        .header("Authorization", "Bearer " + farmerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Fresh Hydroponic Spinach")))
                .andExpect(jsonPath("$.pricePerUnit", is(35.0)))
                .andExpect(jsonPath("$.stockQuantity", is(100)))
                .andExpect(jsonPath("$.categoryName", is("Fresh Vegetables")));
    }

    @Test
    @DisplayName("4. STRICT OWNERSHIP TEST: Farmer B cannot access, edit, or delete Farmer A's product")
    void testCrossFarmerOwnershipSecurity() throws Exception {
        // Step 1: Farmer A creates Product A
        ProductCreateRequest requestA = new ProductCreateRequest(
                "Farmer A Red Tomatoes",
                "Country vine tomatoes",
                testCategory.getId(),
                BigDecimal.valueOf(40.00),
                "kg",
                50,
                5,
                null
        );

        MvcResult result = mockMvc.perform(post("/api/farmer/products")
                        .header("Authorization", "Bearer " + farmerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestA)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode jsonNode = objectMapper.readTree(result.getResponse().getContentAsString());
        String productAId = jsonNode.get("id").asText();
        assertNotNull(productAId);

        // Step 2: Farmer A CAN view Product A
        mockMvc.perform(get("/api/farmer/products/" + productAId)
                        .header("Authorization", "Bearer " + farmerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Farmer A Red Tomatoes")));

        // Step 3: Farmer B CANNOT view Product A -> 403 Forbidden
        mockMvc.perform(get("/api/farmer/products/" + productAId)
                        .header("Authorization", "Bearer " + farmerBToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Step 4: Farmer B CANNOT update Product A -> 403 Forbidden
        ProductUpdateRequest updateAttempt = new ProductUpdateRequest(
                "Hacked by Farmer B",
                "Malicious description",
                testCategory.getId(),
                BigDecimal.valueOf(1.00),
                "kg",
                999,
                1,
                null,
                true
        );

        mockMvc.perform(put("/api/farmer/products/" + productAId)
                        .header("Authorization", "Bearer " + farmerBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateAttempt)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Step 5: Farmer B CANNOT update Product A's inventory -> 403 Forbidden
        InventoryUpdateRequest invAttempt = new InventoryUpdateRequest(0, 0);
        mockMvc.perform(put("/api/farmer/products/" + productAId + "/inventory")
                        .header("Authorization", "Bearer " + farmerBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invAttempt)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Step 6: Farmer B CANNOT delete/deactivate Product A -> 403 Forbidden
        mockMvc.perform(delete("/api/farmer/products/" + productAId)
                        .header("Authorization", "Bearer " + farmerBToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Step 7: Farmer A CAN update Product A
        ProductUpdateRequest legitimateUpdate = new ProductUpdateRequest(
                "Farmer A Premium Red Tomatoes",
                "Updated description",
                testCategory.getId(),
                BigDecimal.valueOf(45.00),
                "kg",
                80,
                5,
                null,
                true
        );

        mockMvc.perform(put("/api/farmer/products/" + productAId)
                        .header("Authorization", "Bearer " + farmerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(legitimateUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Farmer A Premium Red Tomatoes")))
                .andExpect(jsonPath("$.pricePerUnit", is(45.0)))
                .andExpect(jsonPath("$.stockQuantity", is(80)));
    }

    @Test
    @DisplayName("5. Validation errors for invalid product payload")
    void testProductValidationErrors() throws Exception {
        // Missing title, negative price, negative quantity
        String invalidJson = "{" +
                "\"title\": \"\"," +
                "\"categoryId\": " + testCategory.getId() + "," +
                "\"pricePerUnit\": -10.00," +
                "\"unit\": \"kg\"," +
                "\"quantity\": -5" +
                "}";

        mockMvc.perform(post("/api/farmer/products")
                        .header("Authorization", "Bearer " + farmerAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("VALIDATION_ERROR")));
    }

    @Test
    @DisplayName("6. Customer role cannot access farmer endpoints (403 Forbidden)")
    void testCustomerForbiddenFromFarmerEndpoints() throws Exception {
        mockMvc.perform(get("/api/farmer/products")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        mockMvc.perform(get("/api/farmer/stats")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. Farmer dashboard stats endpoint returns accurate counts")
    void testFarmerStatsEndpoint() throws Exception {
        // Create 1 in-stock product
        ProductCreateRequest p1 = new ProductCreateRequest("Carrots", "desc", testCategory.getId(), BigDecimal.valueOf(30), "kg", 50, 5, null);
        mockMvc.perform(post("/api/farmer/products").header("Authorization", "Bearer " + farmerAToken).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(p1))).andExpect(status().isCreated());

        // Create 1 out-of-stock product
        ProductCreateRequest p2 = new ProductCreateRequest("Onions", "desc", testCategory.getId(), BigDecimal.valueOf(25), "kg", 0, 5, null);
        mockMvc.perform(post("/api/farmer/products").header("Authorization", "Bearer " + farmerAToken).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(p2))).andExpect(status().isCreated());

        // Fetch Stats
        mockMvc.perform(get("/api/farmer/stats")
                        .header("Authorization", "Bearer " + farmerAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalProducts", is(2)))
                .andExpect(jsonPath("$.activeProducts", is(2)))
                .andExpect(jsonPath("$.outOfStockProducts", is(1)))
                .andExpect(jsonPath("$.totalInventoryQuantity", is(50)));
    }
}

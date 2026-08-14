package com.farmersmarket;

import com.farmersmarket.dto.ProductCreateRequest;
import com.farmersmarket.dto.ProductResponse;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.service.FarmerProfileService;
import com.farmersmarket.service.ProductService;
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

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PublicProductDiscoveryTest {

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
    private ProductService productService;

    @Autowired
    private FarmerProfileService farmerProfileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired(required = false)
    private com.farmersmarket.repository.ReviewRepository reviewRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.OrderItemRepository orderItemRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.PaymentRepository paymentRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.DeliveryRepository deliveryRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.OrderRepository orderRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CartItemRepository cartItemRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CartRepository cartRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.WishlistRepository wishlistRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.NotificationRepository notificationRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.AddressRepository addressRepository;

    @Autowired(required = false)
    private com.farmersmarket.repository.CustomerProfileRepository customerProfileRepository;

    private Category vegCategory;
    private Category fruitCategory;

    private ProductResponse tomatoProduct;
    private ProductResponse spinachProduct;
    private ProductResponse appleProduct;
    private ProductResponse inactiveProduct;

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Categories
        vegCategory = categoryRepository.save(new Category("Vegetables", "Farm fresh greens", "Carrot"));
        fruitCategory = categoryRepository.save(new Category("Fruits", "Orchard fruits", "Apple"));

        // 2. Farmer
        User farmerUser = new User("Ramesh Farmer", "ramesh@market.local", passwordEncoder.encode("Pass123!"), "9876543210", Role.FARMER);
        farmerUser = userRepository.save(farmerUser);
        farmerProfileService.getOrCreateFarmerProfileEntity(farmerUser);

        // 3. Products
        // Product 1: Tomato (Active, ₹40.00, 100 stock)
        ProductCreateRequest req1 = new ProductCreateRequest("Country Red Tomato", "Fresh farm picked tomatoes", vegCategory.getId(), BigDecimal.valueOf(40.00), "kg", 100, 10, "https://img/tomato.jpg");
        tomatoProduct = productService.createProduct(farmerUser, req1);

        // Product 2: Spinach (Active, ₹25.00, 50 stock)
        ProductCreateRequest req2 = new ProductCreateRequest("Organic Green Spinach", "Tender dark green leaves", vegCategory.getId(), BigDecimal.valueOf(25.00), "bundle", 50, 5, "https://img/spinach.jpg");
        spinachProduct = productService.createProduct(farmerUser, req2);

        // Product 3: Apple (Active, ₹120.00, 80 stock)
        ProductCreateRequest req3 = new ProductCreateRequest("Himachal Royal Apple", "Crisp mountain apples", fruitCategory.getId(), BigDecimal.valueOf(120.00), "kg", 80, 10, "https://img/apple.jpg");
        appleProduct = productService.createProduct(farmerUser, req3);

        // Product 4: Inactive Product (Inactive, ₹15.00) - MUST BE HIDDEN
        ProductCreateRequest req4 = new ProductCreateRequest("Old Stale Radish", "Inactive product", vegCategory.getId(), BigDecimal.valueOf(15.00), "kg", 0, 5, null);
        inactiveProduct = productService.createProduct(farmerUser, req4);
        productService.deleteProduct(inactiveProduct.getId(), farmerUser); // sets isActive = false
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    private void cleanDatabase() {
        if (reviewRepository != null) reviewRepository.deleteAll();
        if (orderItemRepository != null) orderItemRepository.deleteAll();
        if (paymentRepository != null) paymentRepository.deleteAll();
        if (deliveryRepository != null) deliveryRepository.deleteAll();
        if (orderRepository != null) orderRepository.deleteAll();
        if (wishlistRepository != null) wishlistRepository.deleteAll();
        if (cartItemRepository != null) cartItemRepository.deleteAll();
        if (cartRepository != null) cartRepository.deleteAll();
        if (notificationRepository != null) notificationRepository.deleteAll();
        if (addressRepository != null) addressRepository.deleteAll();
        if (customerProfileRepository != null) customerProfileRepository.deleteAll();
        inventoryRepository.deleteAll();
        productRepository.deleteAll();
        farmerProfileRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("1. Public browsing returns all active products without requiring login")
    void testPublicBrowsingActiveOnly() throws Exception {
        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(3))) // 3 active products, inactive radish excluded
                .andExpect(jsonPath("$.content", hasSize(3)))
                .andExpect(jsonPath("$.content[0].farmer.name", is("Ramesh Farmer")));
    }

    @Test
    @DisplayName("2. Keyword search matches title/description case-insensitively")
    void testKeywordSearch() throws Exception {
        // Search "tomato"
        mockMvc.perform(get("/api/products")
                        .param("keyword", "tOmAtO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.content[0].title", is("Country Red Tomato")));

        // Search "green" (matches spinach description "Tender dark green leaves")
        mockMvc.perform(get("/api/products/search")
                        .param("keyword", "green"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.content[0].title", is("Organic Green Spinach")));
    }

    @Test
    @DisplayName("3. Category filtering returns only products in that category")
    void testCategoryFilter() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("categoryId", vegCategory.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(2))) // Tomato and Spinach
                .andExpect(jsonPath("$.content[0].category.name", is("Vegetables")));

        mockMvc.perform(get("/api/products")
                        .param("categoryId", fruitCategory.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1))) // Apple only
                .andExpect(jsonPath("$.content[0].title", is("Himachal Royal Apple")));
    }

    @Test
    @DisplayName("4. Price filtering returns products within min and max boundaries")
    void testPriceFilter() throws Exception {
        // Products: Spinach (25), Tomato (40), Apple (120)
        // Range: 30 to 100 -> only Tomato (40)
        mockMvc.perform(get("/api/products")
                        .param("minPrice", "30.00")
                        .param("maxPrice", "100.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.content[0].title", is("Country Red Tomato")));
    }

    @Test
    @DisplayName("5. Sorting by price-low and price-high works safely")
    void testSorting() throws Exception {
        // Price Low: Spinach (25) -> Tomato (40) -> Apple (120)
        mockMvc.perform(get("/api/products")
                        .param("sort", "price-low"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title", is("Organic Green Spinach")))
                .andExpect(jsonPath("$.content[2].title", is("Himachal Royal Apple")));

        // Price High: Apple (120) -> Tomato (40) -> Spinach (25)
        mockMvc.perform(get("/api/products")
                        .param("sort", "price-high"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title", is("Himachal Royal Apple")))
                .andExpect(jsonPath("$.content[2].title", is("Organic Green Spinach")));
    }

    @Test
    @DisplayName("6. Pagination splits items across pages properly")
    void testPagination() throws Exception {
        // 3 items with size 2 -> Page 0 has 2 items, not last
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page", is(0)))
                .andExpect(jsonPath("$.size", is(2)))
                .andExpect(jsonPath("$.totalElements", is(3)))
                .andExpect(jsonPath("$.totalPages", is(2)))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.last", is(false)));

        // Page 1 has 1 item, is last
        mockMvc.perform(get("/api/products")
                        .param("page", "1")
                        .param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page", is(1)))
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.last", is(true)));
    }

    @Test
    @DisplayName("7. Product Details returns full info with farmer details and stock")
    void testProductDetails() throws Exception {
        mockMvc.perform(get("/api/products/" + tomatoProduct.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(tomatoProduct.getId().toString())))
                .andExpect(jsonPath("$.title", is("Country Red Tomato")))
                .andExpect(jsonPath("$.stockQuantity", is(100)))
                .andExpect(jsonPath("$.farmer.name", is("Ramesh Farmer")));
    }

    @Test
    @DisplayName("8. Inactive product or nonexistent product returns 404 Not Found")
    void testInactiveAndNonexistentProduct() throws Exception {
        // Nonexistent UUID
        mockMvc.perform(get("/api/products/" + UUID.randomUUID()))
                .andExpect(status().isNotFound());

        // Inactive product
        mockMvc.perform(get("/api/products/" + inactiveProduct.getId()))
                .andExpect(status().isNotFound());
    }
}

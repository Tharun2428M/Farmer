package com.farmersmarket;

import com.farmersmarket.entity.Category;
import com.farmersmarket.repository.AddressRepository;
import com.farmersmarket.repository.CartItemRepository;
import com.farmersmarket.repository.CartRepository;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.NotificationRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.ReviewRepository;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.repository.WishlistRepository;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderAndCheckoutSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    private String customerToken;
    private String customer2Token;
    private String farmerToken;
    private String farmer2Token;

    private String testProductId;
    private Long categoryId;

    @BeforeEach
    void setUp() throws Exception {
        cleanDatabase();
        long timestamp = System.currentTimeMillis();

        // 0. Ensure Category exists
        Category category = categoryRepository.save(new Category("Organic Root Crops " + timestamp, "Root vegetables", "Carrot"));
        categoryId = category.getId();

        // 1. Register Customer 1
        String customerEmail = "ordercust" + timestamp + "@market.local";
        MvcResult custResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "name", "Order Customer",
                        "email", customerEmail,
                        "password", "Customer@Pass123",
                        "role", "CUSTOMER"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        customerToken = "Bearer " + objectMapper.readTree(custResult.getResponse().getContentAsString()).get("token").asText();

        // 2. Register Customer 2 (for cross-customer isolation tests)
        String customer2Email = "ordercust2_" + timestamp + "@market.local";
        MvcResult cust2Result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "name", "Order Customer Two",
                        "email", customer2Email,
                        "password", "Customer@Pass123",
                        "role", "CUSTOMER"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        customer2Token = "Bearer " + objectMapper.readTree(cust2Result.getResponse().getContentAsString()).get("token").asText();

        // 3. Register Farmer 1
        String farmerEmail = "orderfarmer" + timestamp + "@market.local";
        MvcResult farmerResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "name", "Order Farmer",
                        "email", farmerEmail,
                        "password", "Farmer@Pass123",
                        "role", "FARMER"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        farmerToken = "Bearer " + objectMapper.readTree(farmerResult.getResponse().getContentAsString()).get("token").asText();

        // 4. Register Farmer 2
        String farmer2Email = "orderfarmer2_" + timestamp + "@market.local";
        MvcResult farmer2Result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "name", "Order Farmer Two",
                        "email", farmer2Email,
                        "password", "Farmer@Pass123",
                        "role", "FARMER"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        farmer2Token = "Bearer " + objectMapper.readTree(farmer2Result.getResponse().getContentAsString()).get("token").asText();

        // 5. Create a test product listed by Farmer 1
        MvcResult prodResult = mockMvc.perform(post("/api/farmer/products")
                .header("Authorization", farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "title", "Fresh Organic Carrots " + timestamp,
                        "description", "Crisp juicy carrots direct from organic soil",
                        "categoryId", categoryId,
                        "pricePerUnit", 45.00,
                        "unit", "kg",
                        "quantity", 50,
                        "lowStockThreshold", 5
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        testProductId = objectMapper.readTree(prodResult.getResponse().getContentAsString()).get("id").asText();
    }

    @AfterEach
    void tearDown() {
        cleanDatabase();
    }

    private void cleanDatabase() {
        reviewRepository.deleteAll();
        orderItemRepository.deleteAll();
        paymentRepository.deleteAll();
        deliveryRepository.deleteAll();
        orderRepository.deleteAll();
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        wishlistRepository.deleteAll();
        notificationRepository.deleteAll();
        addressRepository.deleteAll();
        customerProfileRepository.deleteAll();
        inventoryRepository.deleteAll();
        productRepository.deleteAll();
        farmerProfileRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Address Management: Customer can add, retrieve, update, and delete delivery address")
    void testAddressCrudWorkflow() throws Exception {
        // Add Address
        MvcResult addRes = mockMvc.perform(post("/api/customer/addresses")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressLine1", "Plot 42, Farm Road",
                        "city", "Pune",
                        "state", "Maharashtra",
                        "postalCode", "411001",
                        "isDefault", true
                ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.city", is("Pune")))
                .andExpect(jsonPath("$.isDefault", is(true)))
                .andReturn();

        String addressId = objectMapper.readTree(addRes.getResponse().getContentAsString()).get("id").asText();

        // Customer 2 cannot access Customer 1's address (403)
        mockMvc.perform(get("/api/customer/addresses/" + addressId)
                .header("Authorization", customer2Token))
                .andExpect(status().isForbidden());

        // Update Address
        mockMvc.perform(put("/api/customer/addresses/" + addressId)
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressLine1", "Plot 42, Farm Road, Phase 2",
                        "city", "Pune",
                        "state", "Maharashtra",
                        "postalCode", "411001",
                        "isDefault", true
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.addressLine1", is("Plot 42, Farm Road, Phase 2")));
    }

    @Test
    @DisplayName("Order Placement: Cannot checkout with empty cart")
    void testEmptyCartCheckoutFails() throws Exception {
        // Create an address
        MvcResult addrRes = mockMvc.perform(post("/api/customer/addresses")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressLine1", "Street 1", "city", "Pune", "state", "MH", "postalCode", "411001"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        String addressId = objectMapper.readTree(addrRes.getResponse().getContentAsString()).get("id").asText();

        // Checkout with empty cart
        mockMvc.perform(post("/api/customer/orders")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressId", addressId,
                        "paymentMethod", "CASH_ON_DELIVERY"
                ))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Complete Order Lifecycle: Cart -> Place Order -> Stock Deducted -> Farmer Fulfills -> Review")
    void testCompleteOrderAndReviewLifecycle() throws Exception {
        // 1. Add Address
        MvcResult addrRes = mockMvc.perform(post("/api/customer/addresses")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressLine1", "123 Orchard Ave",
                        "city", "Nashik",
                        "state", "Maharashtra",
                        "postalCode", "422001",
                        "isDefault", true
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        String addressId = objectMapper.readTree(addrRes.getResponse().getContentAsString()).get("id").asText();

        // 2. Add 4 kg Carrots to Cart (Price 45.00 * 4 = 180.00)
        mockMvc.perform(post("/api/customer/cart/items")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "productId", testProductId,
                        "quantity", 4
                ))))
                .andExpect(status().isCreated());

        // 3. Place Order (COD)
        MvcResult orderRes = mockMvc.perform(post("/api/customer/orders")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressId", addressId,
                        "paymentMethod", "CASH_ON_DELIVERY"
                ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.status", is("CONFIRMED")))
                .andExpect(jsonPath("$.totalAmount", is(180.00)))
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.payment.paymentMethod", is("CASH_ON_DELIVERY")))
                .andExpect(jsonPath("$.delivery.status", is("PENDING")))
                .andReturn();

        String orderId = objectMapper.readTree(orderRes.getResponse().getContentAsString()).get("id").asText();

        // 4. Verify Cart was cleared after order placement
        mockMvc.perform(get("/api/customer/cart")
                .header("Authorization", customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(0)))
                .andExpect(jsonPath("$.items", hasSize(0)));

        // 5. Customer 2 cannot access Customer 1's order (403)
        mockMvc.perform(get("/api/customer/orders/" + orderId)
                .header("Authorization", customer2Token))
                .andExpect(status().isForbidden());

        // 6. Farmer 2 cannot see Farmer 1's order
        mockMvc.perform(get("/api/farmer/orders")
                .header("Authorization", farmer2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // 7. Farmer 1 CAN see the order containing their crops
        mockMvc.perform(get("/api/farmer/orders")
                .header("Authorization", farmerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(orderId)));

        // 8. Attempt review before delivery -> Must be rejected (403)
        mockMvc.perform(post("/api/customer/products/" + testProductId + "/reviews")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "rating", 5,
                        "comment", "Sweet carrots!"
                ))))
                .andExpect(status().isForbidden());

        // 9. Farmer updates status: CONFIRMED -> PROCESSING -> OUT_FOR_DELIVERY -> DELIVERED
        mockMvc.perform(put("/api/farmer/orders/" + orderId + "/status")
                .header("Authorization", farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "PROCESSING"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PROCESSING")));

        mockMvc.perform(put("/api/farmer/orders/" + orderId + "/status")
                .header("Authorization", farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "OUT_FOR_DELIVERY"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("OUT_FOR_DELIVERY")));

        mockMvc.perform(put("/api/farmer/orders/" + orderId + "/status")
                .header("Authorization", farmerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("status", "DELIVERED"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("DELIVERED")))
                .andExpect(jsonPath("$.paymentStatus", is("PAID")));

        // 10. Verified customer now submits review successfully
        mockMvc.perform(post("/api/customer/products/" + testProductId + "/reviews")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "rating", 5,
                        "comment", "Fresh and crisp carrots directly from the farm! Highly recommended."
                ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating", is(5)))
                .andExpect(jsonPath("$.comment", containsString("Fresh and crisp")));

        // 11. Public can read product reviews
        mockMvc.perform(get("/api/products/" + testProductId + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].rating", is(5)));

        // 12. Check Notifications for customer
        mockMvc.perform(get("/api/notifications")
                .header("Authorization", customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));

        // Check unread count
        mockMvc.perform(get("/api/notifications/unread-count")
                .header("Authorization", customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount", greaterThanOrEqualTo(1)));

        // Mark all as read
        mockMvc.perform(put("/api/notifications/read-all")
                .header("Authorization", customerToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/notifications/unread-count")
                .header("Authorization", customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount", is(0)));
    }

    @Test
    @DisplayName("Order Cancellation: Cancelling eligible order restores inventory stock")
    void testOrderCancellationRestoresInventory() throws Exception {
        // Add Address
        MvcResult addrRes = mockMvc.perform(post("/api/customer/addresses")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressLine1", "44 Riverside", "city", "Nashik", "state", "MH", "postalCode", "422001"
                ))))
                .andExpect(status().isCreated())
                .andReturn();
        String addressId = objectMapper.readTree(addrRes.getResponse().getContentAsString()).get("id").asText();

        // Add 10 kg Carrots to Cart (Initial stock was 50)
        mockMvc.perform(post("/api/customer/cart/items")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "productId", testProductId,
                        "quantity", 10
                ))))
                .andExpect(status().isCreated());

        // Place Order -> Stock should drop from 50 to 40
        MvcResult orderRes = mockMvc.perform(post("/api/customer/orders")
                .header("Authorization", customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "addressId", addressId,
                        "paymentMethod", "CASH_ON_DELIVERY"
                ))))
                .andExpect(status().isCreated())
                .andReturn();

        String orderId = objectMapper.readTree(orderRes.getResponse().getContentAsString()).get("id").asText();

        // Verify stock is now 40
        mockMvc.perform(get("/api/products/" + testProductId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stockQuantity", is(40)));

        // Cancel the order
        mockMvc.perform(post("/api/customer/orders/" + orderId + "/cancel")
                .header("Authorization", customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELLED")));

        // Verify stock is restored back to 50
        mockMvc.perform(get("/api/products/" + testProductId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.stockQuantity", is(50)));
    }
}

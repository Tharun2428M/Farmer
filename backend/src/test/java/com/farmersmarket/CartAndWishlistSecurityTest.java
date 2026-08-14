package com.farmersmarket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.farmersmarket.dto.AddToCartRequest;
import com.farmersmarket.dto.ProductCreateRequest;
import com.farmersmarket.dto.ProductResponse;
import com.farmersmarket.dto.UpdateCartItemRequest;
import com.farmersmarket.entity.Cart;
import com.farmersmarket.entity.Category;
import com.farmersmarket.entity.CustomerProfile;
import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.CartItemRepository;
import com.farmersmarket.repository.CartRepository;
import com.farmersmarket.repository.CategoryRepository;
import com.farmersmarket.repository.CustomerProfileRepository;
import com.farmersmarket.repository.FarmerProfileRepository;
import com.farmersmarket.repository.InventoryRepository;
import com.farmersmarket.repository.ProductRepository;
import com.farmersmarket.repository.UserRepository;
import com.farmersmarket.repository.WishlistRepository;
import com.farmersmarket.repository.ReviewRepository;
import com.farmersmarket.repository.OrderItemRepository;
import com.farmersmarket.repository.PaymentRepository;
import com.farmersmarket.repository.DeliveryRepository;
import com.farmersmarket.repository.OrderRepository;
import com.farmersmarket.repository.AddressRepository;
import com.farmersmarket.repository.NotificationRepository;
import com.farmersmarket.security.JwtService;
import com.farmersmarket.service.CartService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CartAndWishlistSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private CustomerProfileRepository customerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

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
    private AddressRepository addressRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private FarmerProfileService farmerProfileService;

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User customerA;
    private String tokenCustomerA;

    private User customerB;
    private String tokenCustomerB;

    private User farmerUser;
    private String tokenFarmer;

    private Category vegCategory;
    private ProductResponse tomatoProduct; // Stock = 10, Price = 40.00
    private ProductResponse spinachProduct; // Stock = 5, Price = 25.00

    @BeforeEach
    void setUp() {
        cleanDatabase();

        // 1. Users
        customerA = userRepository.save(new User("Asha Customer", "asha@consumer.local", passwordEncoder.encode("Pass123!"), "9998887771", Role.CUSTOMER));
        tokenCustomerA = "Bearer " + jwtService.generateToken(customerA);

        customerB = userRepository.save(new User("Bharat Customer", "bharat@consumer.local", passwordEncoder.encode("Pass123!"), "9998887772", Role.CUSTOMER));
        tokenCustomerB = "Bearer " + jwtService.generateToken(customerB);

        farmerUser = userRepository.save(new User("Govind Farmer", "govind@farm.local", passwordEncoder.encode("Pass123!"), "9998887773", Role.FARMER));
        tokenFarmer = "Bearer " + jwtService.generateToken(farmerUser);
        farmerProfileService.getOrCreateFarmerProfileEntity(farmerUser);

        // 2. Category & Produce
        vegCategory = categoryRepository.save(new Category("Vegetables", "Fresh greens", "Carrot"));

        ProductCreateRequest reqTomato = new ProductCreateRequest("Organic Red Tomato", "Fresh farm tomatoes", vegCategory.getId(), BigDecimal.valueOf(40.00), "kg", 10, 2, "https://img/tomato.jpg");
        tomatoProduct = productService.createProduct(farmerUser, reqTomato);

        ProductCreateRequest reqSpinach = new ProductCreateRequest("Baby Green Spinach", "Tender organic spinach", vegCategory.getId(), BigDecimal.valueOf(25.00), "bundle", 5, 1, "https://img/spinach.jpg");
        spinachProduct = productService.createProduct(farmerUser, reqSpinach);
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
        wishlistRepository.deleteAll();
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
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
    @DisplayName("1. Customer retrieves empty cart initially")
    void testGetEmptyCart() throws Exception {
        mockMvc.perform(get("/api/customer/cart")
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(0)))
                .andExpect(jsonPath("$.totalAmount", is(0)))
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    @DisplayName("2. Customer adds produce to cart and subtotal/total calculation is accurate")
    void testAddToCartSuccess() throws Exception {
        AddToCartRequest addReq = new AddToCartRequest(tomatoProduct.getId(), 2);

        mockMvc.perform(post("/api/customer/cart/items")
                        .header("Authorization", tokenCustomerA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalQuantity", is(2)))
                .andExpect(jsonPath("$.totalAmount", is(80.00))) // 2 * 40.00
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].productId", is(tomatoProduct.getId().toString())))
                .andExpect(jsonPath("$.items[0].quantity", is(2)))
                .andExpect(jsonPath("$.items[0].subtotal", is(80.00)));
    }

    @Test
    @DisplayName("3. Duplicate add increases existing item quantity without duplicate line items")
    void testDuplicateAddIncreasesQuantity() throws Exception {
        AddToCartRequest addReq1 = new AddToCartRequest(tomatoProduct.getId(), 2);
        mockMvc.perform(post("/api/customer/cart/items")
                .header("Authorization", tokenCustomerA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(addReq1)));

        // Add 3 more tomatoes
        AddToCartRequest addReq2 = new AddToCartRequest(tomatoProduct.getId(), 3);
        mockMvc.perform(post("/api/customer/cart/items")
                        .header("Authorization", tokenCustomerA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq2)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalQuantity", is(5))) // 2 + 3 = 5
                .andExpect(jsonPath("$.totalAmount", is(200.00))) // 5 * 40.00
                .andExpect(jsonPath("$.items", hasSize(1)));
    }

    @Test
    @DisplayName("4. Adding quantity exceeding available stock is rejected with 400 Insufficient Stock")
    void testAddToCartExceedingStockRejected() throws Exception {
        // Spinach stock is 5. Try adding 6
        AddToCartRequest overReq = new AddToCartRequest(spinachProduct.getId(), 6);

        mockMvc.perform(post("/api/customer/cart/items")
                        .header("Authorization", tokenCustomerA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(overReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("INSUFFICIENT_STOCK")));
    }

    @Test
    @DisplayName("5. Customer updates item quantity successfully and subtotal updates")
    void testUpdateCartItemQuantity() throws Exception {
        cartService.addToCart(customerA, new AddToCartRequest(tomatoProduct.getId(), 2));
        Cart cart = cartRepository.findByCustomerIdWithItems(customerA.getId()).orElseThrow();
        UUID cartItemId = cart.getItems().get(0).getId();

        UpdateCartItemRequest updateReq = new UpdateCartItemRequest(4);

        mockMvc.perform(put("/api/customer/cart/items/" + cartItemId)
                        .header("Authorization", tokenCustomerA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(4)))
                .andExpect(jsonPath("$.totalAmount", is(160.00))) // 4 * 40.00
                .andExpect(jsonPath("$.items[0].quantity", is(4)));
    }

    @Test
    @DisplayName("6. Customer B cannot modify or delete Customer A's cart item (Cross-tenant security)")
    void testCrossCustomerCartIsolation() throws Exception {
        cartService.addToCart(customerA, new AddToCartRequest(tomatoProduct.getId(), 2));
        Cart cartA = cartRepository.findByCustomerIdWithItems(customerA.getId()).orElseThrow();
        UUID cartItemAId = cartA.getItems().get(0).getId();

        // Customer B tries to update Customer A's cart item
        UpdateCartItemRequest updateReq = new UpdateCartItemRequest(5);
        mockMvc.perform(put("/api/customer/cart/items/" + cartItemAId)
                        .header("Authorization", tokenCustomerB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden());

        // Customer B tries to delete Customer A's cart item
        mockMvc.perform(delete("/api/customer/cart/items/" + cartItemAId)
                        .header("Authorization", tokenCustomerB))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("7. Customer removes item from cart")
    void testRemoveCartItem() throws Exception {
        cartService.addToCart(customerA, new AddToCartRequest(tomatoProduct.getId(), 2));
        Cart cart = cartRepository.findByCustomerIdWithItems(customerA.getId()).orElseThrow();
        UUID cartItemId = cart.getItems().get(0).getId();

        mockMvc.perform(delete("/api/customer/cart/items/" + cartItemId)
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(0)))
                .andExpect(jsonPath("$.totalAmount", is(0)))
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    @DisplayName("8. Customer clears entire cart")
    void testClearCart() throws Exception {
        cartService.addToCart(customerA, new AddToCartRequest(tomatoProduct.getId(), 2));
        cartService.addToCart(customerA, new AddToCartRequest(spinachProduct.getId(), 1));

        mockMvc.perform(delete("/api/customer/cart")
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalQuantity", is(0)))
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    @DisplayName("9. Customer manages wishlist (add, duplicate prevention, get, remove)")
    void testWishlistWorkflow() throws Exception {
        // 1. Add tomato to wishlist
        mockMvc.perform(post("/api/customer/wishlist/" + tomatoProduct.getId())
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].productId", is(tomatoProduct.getId().toString())))
                .andExpect(jsonPath("$[0].title", is("Organic Red Tomato")));

        // 2. Duplicate addition is idempotent
        mockMvc.perform(post("/api/customer/wishlist/" + tomatoProduct.getId())
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", hasSize(1)));

        // 3. Add spinach
        mockMvc.perform(post("/api/customer/wishlist/" + spinachProduct.getId())
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$", hasSize(2)));

        // 4. Get Wishlist
        mockMvc.perform(get("/api/customer/wishlist")
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        // 5. Remove tomato
        mockMvc.perform(delete("/api/customer/wishlist/" + tomatoProduct.getId())
                        .header("Authorization", tokenCustomerA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].productId", is(spinachProduct.getId().toString())));
    }

    @Test
    @DisplayName("10. Farmer cannot access customer cart or wishlist (Role RBAC test)")
    void testFarmerCannotAccessCustomerCart() throws Exception {
        mockMvc.perform(get("/api/customer/cart")
                        .header("Authorization", tokenFarmer))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/customer/wishlist")
                        .header("Authorization", tokenFarmer))
                .andExpect(status().isForbidden());
    }
}

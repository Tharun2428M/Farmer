package com.farmersmarket;

import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
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

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RoleBasedAccessControlTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String customerToken;
    private String farmerToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // 1. Create Customer
        User customer = new User("Customer User", "cust@example.com", passwordEncoder.encode("Pass123!"), "9998887771", Role.CUSTOMER);
        User savedCust = userRepository.save(customer);
        customerToken = jwtService.generateToken(savedCust);

        // 2. Create Farmer
        User farmer = new User("Farmer User", "farmer@example.com", passwordEncoder.encode("Pass123!"), "9998887772", Role.FARMER);
        User savedFarmer = userRepository.save(farmer);
        farmerToken = jwtService.generateToken(savedFarmer);

        // 3. Create Admin
        User admin = new User("Admin User", "admin@example.com", passwordEncoder.encode("Pass123!"), "9998887773", Role.ADMIN);
        User savedAdmin = userRepository.save(admin);
        adminToken = jwtService.generateToken(savedAdmin);
    }

    @Test
    @DisplayName("1. Unauthenticated request to protected endpoints returns 401 Unauthorized")
    void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/customer/test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));

        mockMvc.perform(get("/api/farmer/test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));

        mockMvc.perform(get("/api/admin/test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("2. CUSTOMER can access customer endpoint, but is forbidden from farmer and admin endpoints")
    void testCustomerRoleAccess() throws Exception {
        // Customer endpoint -> 200 OK
        mockMvc.perform(get("/api/customer/test")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.role", is("CUSTOMER")));

        // Farmer endpoint -> 403 Forbidden
        mockMvc.perform(get("/api/farmer/test")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Admin endpoint -> 403 Forbidden
        mockMvc.perform(get("/api/admin/test")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("3. FARMER can access farmer endpoint, but is forbidden from customer and admin endpoints")
    void testFarmerRoleAccess() throws Exception {
        // Farmer endpoint -> 200 OK
        mockMvc.perform(get("/api/farmer/test")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.role", is("FARMER")));

        // Customer endpoint -> 403 Forbidden
        mockMvc.perform(get("/api/customer/test")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));

        // Admin endpoint -> 403 Forbidden
        mockMvc.perform(get("/api/admin/test")
                        .header("Authorization", "Bearer " + farmerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("FORBIDDEN")));
    }

    @Test
    @DisplayName("4. ADMIN can access admin endpoint")
    void testAdminRoleAccess() throws Exception {
        // Admin endpoint -> 200 OK
        mockMvc.perform(get("/api/admin/test")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.role", is("ADMIN")));
    }
}

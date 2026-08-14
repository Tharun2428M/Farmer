package com.farmersmarket;

import com.farmersmarket.controller.HealthController;
import com.farmersmarket.repository.CategoryPingRepository;
import com.farmersmarket.service.DatabaseHealthService;
import com.farmersmarket.service.JpaPingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class FarmersMarketApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired(required = false)
    private DatabaseHealthService databaseHealthService;

    @Autowired(required = false)
    private JpaPingService jpaPingService;

    @Autowired(required = false)
    private CategoryPingRepository categoryPingRepository;

    @Test
    @DisplayName("1. Spring Application Context and Essential Services Load Successfully")
    void contextLoads() {
        assertThat(databaseHealthService).isNotNull();
        assertThat(jpaPingService).isNotNull();
        assertThat(categoryPingRepository).isNotNull();
    }

    @Test
    @DisplayName("2. GET /api/health returns UP and CONNECTED when database is reachable")
    void testHealthEndpointSuccess() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")))
                .andExpect(jsonPath("$.database", is("CONNECTED")));
    }

    @Test
    @DisplayName("3. Category JPA Repository verifies database communication")
    void testCategoryPingRepositoryQuery() {
        long count = jpaPingService.getCategoryCount();
        assertThat(count).isGreaterThanOrEqualTo(0L);
    }

    @Test
    @DisplayName("4. CORS Configuration permits React frontend development origin")
    void testCorsConfiguration() throws Exception {
        mockMvc.perform(options("/api/health")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}

package com.farmersmarket;

import com.farmersmarket.service.DatabaseHealthService;
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

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerDisconnectedTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DatabaseHealthService databaseHealthService;

    @Test
    @DisplayName("5. GET /api/health returns DOWN and DISCONNECTED with HTTP 503 when database is unreachable")
    void testHealthEndpointDatabaseDisconnected() throws Exception {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("connected", false);
        errorMap.put("status", "DISCONNECTED");
        errorMap.put("error", "Database connection timeout");

        when(databaseHealthService.checkDatabaseConnection()).thenReturn(errorMap);

        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status", is("DOWN")))
                .andExpect(jsonPath("$.database", is("DISCONNECTED")));
    }
}

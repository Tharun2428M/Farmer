package com.farmersmarket;

import com.farmersmarket.service.DatabaseHealthService;
import com.farmersmarket.service.JpaPingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class FarmersMarketApplicationTests {

    @Autowired(required = false)
    private DatabaseHealthService databaseHealthService;

    @Autowired(required = false)
    private JpaPingService jpaPingService;

    @Test
    void contextLoads() {
        assertThat(databaseHealthService).isNotNull();
        assertThat(jpaPingService).isNotNull();
    }
}

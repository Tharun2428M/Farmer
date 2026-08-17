package com.farmersmarket.service;

import com.farmersmarket.dto.SystemHealthDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;

@Service
public class AdminSystemHealthService {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public AdminSystemHealthService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SystemHealthDto getSystemHealth() {
        SystemHealthDto health = new SystemHealthDto();
        health.setStatus("UP");
        health.setApiStatus("OPERATIONAL");
        health.setAppVersion("1.0.0");
        health.setEnvironment("Production (Supabase PostgreSQL)");

        // Measure database ping latency
        long start = System.currentTimeMillis();
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            long latency = System.currentTimeMillis() - start;
            health.setDatabaseStatus("CONNECTED");
            health.setDatabaseLatencyMs(latency);
        } catch (Exception ex) {
            health.setDatabaseStatus("DEGRADED: " + ex.getMessage());
            health.setDatabaseLatencyMs(-1);
            health.setStatus("DEGRADED");
        }

        // JVM Memory
        Runtime runtime = Runtime.getRuntime();
        long totalMem = runtime.totalMemory() / (1024 * 1024);
        long freeMem = runtime.freeMemory() / (1024 * 1024);
        long usedMem = totalMem - freeMem;

        health.setJvmTotalMemoryMb(totalMem);
        health.setJvmFreeMemoryMb(freeMem);
        health.setJvmUsedMemoryMb(usedMem);

        // System Uptime
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;
        health.setSystemUptimeSeconds(uptimeSeconds);

        return health;
    }
}

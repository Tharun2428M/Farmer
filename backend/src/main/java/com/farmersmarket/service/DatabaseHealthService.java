package com.farmersmarket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Service
public class DatabaseHealthService {

    private final DataSource dataSource;

    @Autowired
    public DatabaseHealthService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Map<String, Object> checkDatabaseConnection() {
        Map<String, Object> statusMap = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2);
            if (isValid) {
                statusMap.put("connected", true);
                statusMap.put("status", "CONNECTED");
                statusMap.put("databaseProduct", connection.getMetaData().getDatabaseProductName());
            } else {
                statusMap.put("connected", false);
                statusMap.put("status", "UNAVAILABLE");
                statusMap.put("error", "Database connection validation failed");
            }
        } catch (SQLException ex) {
            statusMap.put("connected", false);
            statusMap.put("status", "DISCONNECTED");
            statusMap.put("error", "Failed to obtain database connection: " + ex.getMessage());
        }
        return statusMap;
    }
}

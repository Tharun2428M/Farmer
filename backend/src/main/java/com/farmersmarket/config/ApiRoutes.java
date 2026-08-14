package com.farmersmarket.config;

/**
 * Architectural Registry defining the standard REST API base paths
 * planned for the Local Farmers Produce Direct-Selling Marketplace.
 *
 * All endpoints are scoped under '/api' prefix to ensure consistency
 * across upcoming phases.
 */
public final class ApiRoutes {

    private ApiRoutes() {
        // Prevent instantiation
    }

    public static final String API_BASE = "/api";

    // System & Connectivity (Implemented in Phase 3)
    public static final String HEALTH = API_BASE + "/health";

    // Authentication & Identity (Phase 4+)
    public static final String AUTH = API_BASE + "/auth";
    public static final String USERS = API_BASE + "/users";
    public static final String FARMERS = API_BASE + "/farmers";
    public static final String CUSTOMERS = API_BASE + "/customers";

    // Catalog & Inventory (Phase 5+)
    public static final String PRODUCTS = API_BASE + "/products";
    public static final String CATEGORIES = API_BASE + "/categories";

    // Ordering & Purchasing (Phase 6+)
    public static final String CART = API_BASE + "/cart";
    public static final String ORDERS = API_BASE + "/orders";
    public static final String PAYMENTS = API_BASE + "/payments";
    public static final String DELIVERIES = API_BASE + "/deliveries";

    // Social & Engagement (Phase 7+)
    public static final String REVIEWS = API_BASE + "/reviews";
    public static final String WISHLIST = API_BASE + "/wishlist";

    // Platform Administration (Phase 8+)
    public static final String ADMIN = API_BASE + "/admin";
}

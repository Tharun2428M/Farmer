package com.farmersmarket.entity;

/**
 * Role enumeration defining application user roles:
 * - CUSTOMER: Regular consumer buying produce.
 * - FARMER: Producer selling agricultural goods.
 * - ADMIN: Platform administrator with platform-wide oversight.
 */
public enum Role {
    CUSTOMER,
    FARMER,
    ADMIN;

    /**
     * Checks if the given role string is allowed for self-service public registration.
     * Normal users can NEVER register as ADMIN.
     */
    public static boolean isPublicRegistrationAllowed(Role role) {
        return role != null && role != ADMIN;
    }
}

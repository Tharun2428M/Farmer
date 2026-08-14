package com.farmersmarket.config;

import com.farmersmarket.entity.Role;
import com.farmersmarket.entity.User;
import com.farmersmarket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Safely initializes the first platform ADMIN account if none exists.
 * Admin credentials can be passed via environment variables (ADMIN_EMAIL, ADMIN_PASSWORD),
 * or a secure random password is generated dynamically and logged on startup.
 */
@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:${ADMIN_EMAIL:}}")
    private String configuredAdminEmail;

    @Value("${app.admin.password:${ADMIN_PASSWORD:}}")
    private String configuredAdminPassword;

    @Autowired
    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            boolean adminExists = userRepository.existsByRole(Role.ADMIN);
            if (adminExists) {
                logger.info("Admin account already exists in database. Skipping admin initialization.");
                return;
            }

            String adminEmail = (configuredAdminEmail != null && !configuredAdminEmail.trim().isEmpty())
                    ? configuredAdminEmail.trim().toLowerCase()
                    : "admin@farmersmarket.local";

            String rawPassword;
            if (configuredAdminPassword != null && !configuredAdminPassword.trim().isEmpty()) {
                rawPassword = configuredAdminPassword.trim();
            } else {
                byte[] randomBytes = new byte[12];
                new SecureRandom().nextBytes(randomBytes);
                rawPassword = "Admin!" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
            }

            User adminUser = new User();
            adminUser.setName("System Administrator");
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(rawPassword));
            adminUser.setPhone("+91-0000000000");
            adminUser.setRole(Role.ADMIN);
            adminUser.setStatus("ACTIVE");

            userRepository.save(adminUser);

            logger.info("=================================================================");
            logger.info("INITIAL ADMIN ACCOUNT CREATED SUCCESSFULLY:");
            logger.info("Email:    {}", adminEmail);
            logger.info("Password: {}", rawPassword);
            logger.info("Role:     ADMIN");
            logger.info("Please change this password or configure ADMIN_PASSWORD in .env.");
            logger.info("=================================================================");
        } catch (Exception ex) {
            logger.warn("Admin initialization skipped or failed: {}", ex.getMessage());
        }
    }
}

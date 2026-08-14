package com.farmersmarket;

import com.farmersmarket.dto.ApiResponse;
import com.farmersmarket.exception.AccountDisabledException;
import com.farmersmarket.exception.EmailAlreadyExistsException;
import com.farmersmarket.exception.ForbiddenRoleException;
import com.farmersmarket.exception.GlobalExceptionHandler;
import com.farmersmarket.exception.InvalidCredentialsException;
import com.farmersmarket.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    @DisplayName("1. Handles EmailAlreadyExistsException with 409 Conflict")
    void testEmailAlreadyExistsHandling() {
        EmailAlreadyExistsException ex = new EmailAlreadyExistsException("Email already taken");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleEmailAlreadyExists(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("CONFLICT");
        assertThat(response.getBody().getMessage()).isEqualTo("Email already taken");
    }

    @Test
    @DisplayName("2. Handles InvalidCredentialsException with 401 Unauthorized")
    void testInvalidCredentialsHandling() {
        InvalidCredentialsException ex = new InvalidCredentialsException("Invalid email or password.");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleInvalidCredentials(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("UNAUTHORIZED");
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid email or password.");
    }

    @Test
    @DisplayName("3. Handles AccountDisabledException with 403 Forbidden")
    void testAccountDisabledHandling() {
        AccountDisabledException ex = new AccountDisabledException("Account is disabled");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleAccountDisabled(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("FORBIDDEN");
    }

    @Test
    @DisplayName("4. Handles ForbiddenRoleException with 400 Bad Request")
    void testForbiddenRoleHandling() {
        ForbiddenRoleException ex = new ForbiddenRoleException("Cannot register as ADMIN");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleForbiddenRole(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("BAD_REQUEST");
    }

    @Test
    @DisplayName("5. Handles AccessDeniedException with 403 Forbidden")
    void testAccessDeniedHandling() {
        AccessDeniedException ex = new AccessDeniedException("Access Denied");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleAccessDenied(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("FORBIDDEN");
    }

    @Test
    @DisplayName("6. Handles ResourceNotFoundException with 404 Not Found")
    void testResourceNotFoundHandling() {
        ResourceNotFoundException ex = new ResourceNotFoundException("User not found with id 123");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleResourceNotFound(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("NOT_FOUND");
        assertThat(response.getBody().getMessage()).isEqualTo("User not found with id 123");
    }

    @Test
    @DisplayName("7. Handles DataAccessException with 503 Service Unavailable and safe message")
    void testDatabaseExceptionHandling() {
        DataRetrievalFailureException ex = new DataRetrievalFailureException("Internal connection failure");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleDatabaseException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("DATABASE_ERROR");
        assertThat(response.getBody().getMessage()).isEqualTo("A database communication error occurred");
    }

    @Test
    @DisplayName("8. Handles generic Exception with 500 Internal Server Error")
    void testGeneralExceptionHandling() {
        RuntimeException ex = new RuntimeException("Unexpected error");
        ResponseEntity<ApiResponse<Void>> response = exceptionHandler.handleGlobalException(ex);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("SERVER_ERROR");
    }
}

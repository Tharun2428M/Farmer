# Local Farmers Produce Direct-Selling Marketplace — Backend

## Project Overview
The **Local Farmers Produce Direct-Selling Marketplace** is an e-commerce platform connecting local farmers directly with consumers. This backend service is built with **Java** and **Spring Boot**, featuring secure, stateless **JWT-based Authentication** and **Role-Based Access Control (RBAC)** across a **Supabase PostgreSQL** database.

---

## Backend Technologies
- **Java**: 17 (OpenJDK 17 Temurin)
- **Framework**: Spring Boot 3.3.2
- **Build Tool**: Apache Maven 3.9.9
- **Database**: Supabase PostgreSQL (Managed Cloud Database)
- **Persistence / ORM**: Spring Data JPA / Hibernate 6.5 (`PostgreSQLDialect`)
- **Authentication**: JWT via JJWT 0.12.5 (`io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- **Password Hashing**: BCrypt (`BCryptPasswordEncoder` with strength 12)
- **Security**: Spring Security 6 (Stateless JWT Filter Chain, `hasRole()` authorization)
- **Configuration**: Dotenv Java (`io.github.cdimascio:dotenv-java`) & Spring Boot Externalized Properties
- **Testing**: JUnit 5, Mockito, AssertJ, Spring Boot Test, MockMvc, H2 In-Memory (test scope)
- **Monitoring & Health**: Spring Boot Actuator

---

## Backend Package Structure
```
backend/
├── pom.xml
├── README.md
├── .env.example
├── phase4_auth_migration.sql
├── supabase_schema.sql
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/farmersmarket/
    │   │       ├── FarmersMarketApplication.java
    │   │       ├── config/
    │   │       │   ├── AdminInitializer.java
    │   │       │   ├── ApiRoutes.java
    │   │       │   ├── CorsConfig.java
    │   │       │   └── SecurityConfig.java
    │   │       ├── controller/
    │   │       │   ├── AuthController.java
    │   │       │   ├── HealthController.java
    │   │       │   └── TestAuthController.java
    │   │       ├── dto/
    │   │       │   ├── ApiResponse.java
    │   │       │   ├── AuthResponse.java
    │   │       │   ├── LoginRequest.java
    │   │       │   ├── RegisterRequest.java
    │   │       │   └── UserSummaryDto.java
    │   │       ├── entity/
    │   │       │   ├── CategoryPing.java
    │   │       │   ├── Role.java
    │   │       │   └── User.java
    │   │       ├── exception/
    │   │       │   ├── AccountDisabledException.java
    │   │       │   ├── EmailAlreadyExistsException.java
    │   │       │   ├── ForbiddenRoleException.java
    │   │       │   ├── GlobalExceptionHandler.java
    │   │       │   ├── InvalidCredentialsException.java
    │   │       │   └── ResourceNotFoundException.java
    │   │       ├── repository/
    │   │       │   ├── CategoryPingRepository.java
    │   │       │   └── UserRepository.java
    │   │       ├── security/
    │   │       │   ├── CustomAccessDeniedHandler.java
    │   │       │   ├── CustomAuthenticationEntryPoint.java
    │   │       │   ├── CustomUserDetailsService.java
    │   │       │   ├── JwtAuthenticationFilter.java
    │   │       │   └── JwtService.java
    │   │       └── service/
    │   │           ├── AuthService.java
    │   │           ├── DatabaseHealthService.java
    │   │           └── JpaPingService.java
    │   └── resources/
    │       ├── application.properties
    │       └── application-local.properties
    └── test/
        ├── java/
        │   └── com/farmersmarket/
        │       ├── AuthControllerTest.java
        │       ├── FarmersMarketApplicationTests.java
        │       ├── GlobalExceptionHandlerTest.java
        │       ├── HealthControllerDisconnectedTest.java
        │       ├── JwtServiceTest.java
        │       └── RoleBasedAccessControlTest.java
        └── resources/
            └── application.properties
```

---

## Roles & Access Hierarchy
The platform supports three distinct roles:
1. **`CUSTOMER`**: Can browse products, manage shopping cart, place orders, make payments, and write reviews.
2. **`FARMER`**: Can manage farm profile, list produce catalog, manage inventory stock, and track order dispatches.
3. **`ADMIN`**: Platform oversight, catalog category moderation, user account verification, and dispute resolution.

> [!CAUTION]
> **Admin Registration Security Rule:**
> Public registration as `ADMIN` is strictly forbidden. Any registration request providing `role: "ADMIN"` is rejected by the server with `400 Bad Request`.

---

## Environment Variables Configuration

Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cp .env.example .env
```

Populate the required values:
```env
# Supabase PostgreSQL Database Credentials
DB_URL=jdbc:postgresql://db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=YOUR_STRONG_DATABASE_PASSWORD

# JWT Secret & Expiration (Minimum 256 bits)
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_bytes_long_2026!
JWT_EXPIRATION_MS=86400000

# Platform Initial Admin Setup (Optional)
ADMIN_EMAIL=admin@farmersmarket.local
ADMIN_PASSWORD=YourStrongAdminPassword2026!

# Server & CORS
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

---

## Database Migration (Supabase Compatibility)
If your `public.users` table was initialized in Phase 2, execute `phase4_auth_migration.sql` in the Supabase SQL editor:
```sql
ALTER TABLE public.users 
    ADD COLUMN IF NOT EXISTS name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS password VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
```

---

## How Initial Admin Account is Created
1. **Automatic Initialization via `AdminInitializer`**:
   On application startup, if no user with `role = 'ADMIN'` exists:
   - If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are provided in `.env`, the admin account is automatically provisioned using BCrypt hashing.
   - If no password is provided in `.env`, a secure random 16-character password is generated and logged to the console at startup.
2. **Manual SQL Direct Insert (Optional)**:
   You can run the script in `phase4_auth_migration.sql` with a pre-hashed BCrypt password.

---

## API Documentation (Phase 4)

### 1. Register User
* **Method:** `POST`
* **URL:** `/api/auth/register`
* **Auth Required:** No (Public)
* **Allowed Roles for Registration:** `CUSTOMER`, `FARMER`

#### Request Body (Customer):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

#### Request Body (Farmer):
```json
{
  "name": "Ramesh Patil",
  "email": "farmer.ramesh@example.com",
  "password": "FarmPassword123",
  "phone": "9123456789",
  "role": "FARMER"
}
```

#### Success Response (`201 Created`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "e0b0bb11-47fa-4ce6-9b16-f7f123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
}
```

#### Error Responses:
* `400 Bad Request`: Validation failure (e.g. invalid email, short password, or attempting `ADMIN` role).
* `409 Conflict`: Email already exists.

---

### 2. Login User
* **Method:** `POST`
* **URL:** `/api/auth/login`
* **Auth Required:** No (Public)

#### Request Body:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Success Response (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "e0b0bb11-47fa-4ce6-9b16-f7f123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "CUSTOMER",
    "status": "ACTIVE"
  }
}
```

#### Error Responses:
* `401 Unauthorized`: Invalid email or password.
* `403 Forbidden`: Account is inactive/suspended.

---

### 3. Role-Protected Test Endpoints

| Endpoint | Method | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `/api/customer/test` | `GET` | `CUSTOMER` (or `ADMIN`) | Protected test endpoint for customer verification |
| `/api/farmer/test` | `GET` | `FARMER` (or `ADMIN`) | Protected test endpoint for farmer verification |
| `/api/admin/test` | `GET` | `ADMIN` | Protected test endpoint for admin verification |

#### Headers Required:
```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

#### Success Response (`200 OK`):
```json
{
  "status": "SUCCESS",
  "message": "Customer protected endpoint accessed successfully",
  "data": {
    "role": "CUSTOMER",
    "authenticatedUser": "john@example.com",
    "authorities": "[ROLE_CUSTOMER]"
  },
  "timestamp": "2026-08-14T12:00:00"
}
```

#### Error Responses:
* `401 Unauthorized`: Missing, invalid, or expired JWT token.
* `403 Forbidden`: Authenticated user lacks the required role.

---

## JWT Authentication Flow Explanation

```
[ Client (React) ]                      [ Spring Boot Backend ]                      [ Supabase PostgreSQL ]
        |                                         |                                             |
        |--- 1. POST /api/auth/login ------------>|                                             |
        |    {email, password}                    |--- 2. Load User by email ------------------>|
        |                                         |<-- 3. Return user record (BCrypt hash) -----|
        |                                         |                                             |
        |                                         |--- 4. Verify password via BCrypt.matches()  |
        |                                         |--- 5. Generate HMAC-SHA256 JWT Token        |
        |<-- 6. Return {token, user summary} -----|                                             |
        |                                         |                                             |
        |--- 7. GET /api/customer/test ---------->|                                             |
        |    Authorization: Bearer <token>        |--- 8. JwtAuthenticationFilter intercepts    |
        |                                         |--- 9. Validates signature & claims          |
        |                                         |--- 10. Sets SecurityContextHolder           |
        |                                         |--- 11. Authorizes hasRole("CUSTOMER")       |
        |<-- 12. Return 200 OK + Payload ---------|                                             |
```

---

## Frontend Integration Guide (For Upcoming React Implementation)

When connecting the React frontend in subsequent phases:

1. **Login & Registration Call**:
   Make an HTTP POST request from React to `/api/auth/login` or `/api/auth/register`.
2. **Token Storage**:
   Store the received JWT in `localStorage` or `sessionStorage` (or memory/HTTP-only cookie strategy).
3. **Axios / Fetch Interceptor**:
   Attach the Authorization header on every outgoing API call:
   ```javascript
   const token = localStorage.getItem("token");
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```
4. **Logout Flow**:
   Remove the token from browser storage and reset the auth context state.

---

## Current Development Status
- **PHASE 1**: Completed (Architecture, tech stack & database design)
- **PHASE 2**: Completed (Supabase PostgreSQL schema, tables, triggers, RLS & seed data verified)
- **PHASE 3**: Completed (Spring Boot backend foundation, secure Supabase connection, JPA validation, health check, CORS)
- **PHASE 4**: **COMPLETED** (Authentication, BCrypt password hashing, JWT Service & Filter, Role-Based Access Control, Admin provisioning, 29/29 tests passing)

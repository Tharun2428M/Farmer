# Local Farmers Produce Direct-Selling Marketplace - Backend

## Project Name
**Local Farmers Produce Direct-Selling Marketplace (Backend)**

## Backend Technologies
- **Java**: 17 (OpenJDK 17)
- **Framework**: Spring Boot 3.3.2
- **Build Tool**: Apache Maven 3.9.9
- **Database**: Supabase PostgreSQL
- **Persistence**: Spring Data JPA / Hibernate (PostgreSQL Dialect)
- **Security**: Spring Security (Configured baseline)
- **Utilities**: Lombok, Spring Boot Validation, Actuator

---

## Requirements
1. **JDK 17** installed and configured (`JAVA_HOME`).
2. **Maven 3.9+** (or installed system Maven).
3. **Supabase PostgreSQL** instance with database credentials.

---

## How to Configure Environment Variables
Environment variables must **NEVER** be committed to source code.

Set the following environment variables in your operating system or local run configuration:

```bash
DB_URL=jdbc:postgresql://<YOUR_SUPABASE_HOST>:5432/postgres
DB_USERNAME=<YOUR_SUPABASE_DB_USER>
DB_PASSWORD=<YOUR_SUPABASE_DB_PASSWORD>
SERVER_PORT=8080
```

Alternatively, copy `application-local.properties` or set them in your IDE launch configuration.

---

## How to Install Dependencies
Run Maven compile to fetch dependencies:

```bash
mvn clean compile
```

---

## How to Run the Spring Boot Application
Pass your database environment variables when launching the application:

```bash
$env:DB_URL="jdbc:postgresql://<HOST>:5432/postgres"
$env:DB_USERNAME="postgres.<PROJECT_REF>"
$env:DB_PASSWORD="<PASSWORD>"
mvn spring-boot:run
```

---

## Database Configuration & Schema Preservation
- **Dialect**: `org.hibernate.dialect.PostgreSQLDialect`
- **DDL Mode**: `spring.jpa.hibernate.ddl-auto=validate`

> [!IMPORTANT]
> `ddl-auto` is set to **`validate`** to ensure Hibernate only verifies existing table structures against JPA models and **never** creates, alters, or drops schema tables created in Phase 2.

---

## Health-Check Endpoint
Verify backend status and Supabase PostgreSQL connectivity:

```http
GET http://localhost:8080/api/health
```

### Response (Database Available):
```json
{
  "status": "UP",
  "database": "CONNECTED"
}
```

### Response (Database Unavailable):
```json
HTTP 503 Service Unavailable
{
  "status": "DOWN",
  "database": "DISCONNECTED"
}
```

---

## REST API Controller Architecture Prepared
- `/api/auth`
- `/api/users`
- `/api/farmers`
- `/api/customers`
- `/api/products`
- `/api/categories`
- `/api/cart`
- `/api/orders`
- `/api/payments`
- `/api/deliveries`
- `/api/reviews`
- `/api/wishlist`
- `/api/admin`

---

## Current Development Status
- **PHASE 1**: Completed (Architecture & Schema design)
- **PHASE 2**: Completed (Supabase SQL Schema created & verified)
- **PHASE 3**: **Completed** (Spring Boot foundation & Supabase PostgreSQL database connectivity established)

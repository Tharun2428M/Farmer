# Deployment & Production Architecture Guide

## Local Farmers Produce Direct-Selling Marketplace

---

## 1. System Architecture Overview

The system is organized into a 3-tier decoupled architecture:
1. **Frontend Client**: React 18 + Vite (SPA) deployed to Vercel / Netlify / Cloudflare Pages.
2. **Backend API**: Java 17 + Spring Boot 3.3.2 + Spring Security (JWT) deployed on Render / Railway / AWS EC2 / Docker.
3. **Database Layer**: Managed PostgreSQL hosted on **Supabase** with connection pooling (HikariCP / PgBouncer).

---

## 2. Database Deployment (Supabase PostgreSQL)

1. **Create Supabase Project**:
   - Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
   - Note the **Host**, **Database Name** (`postgres`), **Port** (`5432` or `6543`), and **Database Password**.

2. **Execute Schema & Performance Indexing Scripts**:
   - In Supabase **SQL Editor**, run the foundational schema DDL scripts.
   - Run `backend/phase10_admin_indexes.sql` to generate performance indexes for admin analytics, search, and low-stock filters.

3. **Verify Database Connection**:
   - Connection URL Format:
     ```
     jdbc:postgresql://db.<PROJECT_ID>.supabase.co:5432/postgres?sslmode=require
     ```

---

## 3. Backend Deployment (Spring Boot 3)

### Option A: Deploy on Render / Railway

1. **Create Web Service**:
   - Link your GitHub repository.
   - Set Root Directory: `backend`.
   - Set Build Command: `mvn clean package -DskipTests`.
   - Set Start Command: `java -Dserver.port=$PORT -jar target/farmers-marketplace-backend-0.0.1-SNAPSHOT.jar`.

2. **Set Production Environment Variables**:
   ```env
   PORT=8080
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.<PROJECT_ID>.supabase.co:5432/postgres?sslmode=require
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=<YOUR_SUPABASE_PASSWORD>
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   JWT_SECRET=<MIN_64_CHAR_HEX_SECRET_STRING>
   JWT_EXPIRATION_MS=86400000
   APP_CORS_ALLOWED_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:5173
   ```

### Option B: Docker Container Deployment

```dockerfile
# Multi-stage Dockerfile
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 4. Frontend Deployment (React + Vite)

### Deploy on Vercel / Netlify

1. **Import Repository**:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://your-spring-boot-backend.onrender.com/api
   ```

3. **Configure SPA Rewrite Routing**:
   Create or verify `frontend/vercel.json` or `frontend/public/_redirects`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 5. Production Security & Audit Checklist

- [x] **Role-Based Access Control**: All `/api/admin/**` protected by `@PreAuthorize("hasRole('ADMIN')")`.
- [x] **Password Protection**: Passwords hashed with BCrypt (10 rounds); never exposed in DTOs.
- [x] **Stateless JWT**: Bearer tokens verified per request via `JwtAuthenticationFilter`.
- [x] **Safe Admin Safeguard**: Admin cannot self-deactivate or delete their own admin privileges.
- [x] **Integrity Guardrails**: Soft-deletion used for produce and categories with existing order history.
- [x] **CORS Lockdown**: Production CORS restricted to authorized domain origins.
- [x] **Database SSL**: `sslmode=require` enabled for all Supabase queries.
- [x] **RFC 4180 CSV**: Financial and order reports sanitized against formula injection.

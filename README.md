# Local Farmers Produce Direct-Selling Marketplace

> **Capstone Project Phase 1: Foundation & Architecture Setup**

An online marketplace connecting local agricultural farmers directly with end customers. Farmers can list produce, set daily stock and prices, manage incoming orders, and track revenue. Customers can browse fresh local harvests, add items to cart, place orders, track deliveries, and write verified reviews. Admins oversee quality compliance, user roles, and platform activity.

---

## 🏗️ Architecture & Tech Stack

```
[ React 18 Frontend (Vite) ] ── (Axios REST API) ──> [ Spring Boot 3 Backend ] ──> [ Supabase PostgreSQL ]
```

### **Frontend Stack**
- **Framework**: React 18 (Vite build tool)
- **Routing**: React Router v6
- **HTTP Client**: Axios with central API configuration & interceptors
- **Icons**: Lucide React
- **Styling**: Vanilla CSS custom design system (Forest Green, Earth Brown, Light Green, Glassmorphism, Responsive Grid)

### **Backend Stack**
- **Framework**: Java 17+ / Spring Boot 3.3.2 (Maven)
- **Modules**: Spring Web, Spring Data JPA, Spring Security, Validation, Actuator
- **Security & Auth Architecture**: Spring Security 6 stateless filter chain, JWT authentication foundation
- **Database Driver**: PostgreSQL (Supabase cloud instance) with H2 local fallback

---

## 📁 Directory Structure

```
local-farmers-marketplace/
├── frontend/
│   ├── src/
│   │   ├── components/       # Header, Footer, Navigation, Loading, Error components
│   │   ├── pages/            # Home (Landing), Login, Register, Customer/Farmer/Admin Dashboards
│   │   ├── layouts/          # MainLayout wrapper
│   │   ├── services/         # Centralized Axios API configuration (api.js)
│   │   ├── hooks/            # Custom hooks (useAuth.js)
│   │   ├── context/          # AuthContext & state provider
│   │   ├── utils/            # Helper utilities
│   │   ├── assets/           # Media & visual assets
│   │   ├── App.jsx           # React Router route registry
│   │   ├── main.jsx          # React DOM entrypoint
│   │   └── index.css         # Agricultural CSS Design System
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── .env.example
│
├── backend/
│   ├── src/main/java/
│   │   └── com/farmersmarket/
│   │       ├── config/       # CorsConfig, SecurityConfig
│   │       ├── controller/   # HealthController (GET /api/health)
│   │       ├── service/      # Business logic layer (Phase 2 connection)
│   │       ├── repository/   # Spring Data JPA repositories (Phase 2 connection)
│   │       ├── entity/       # JPA entities for Users, Products, Orders, Reviews
│   │       ├── dto/          # ApiResponse, Request/Response DTOs
│   │       ├── exception/    # GlobalExceptionHandler, ResourceNotFoundException
│   │       └── security/     # JWT filters & role utilities
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── .env.example
│
└── README.md
```

---

## 🔐 Environment Variables Configuration

### **Frontend (`frontend/.env`)**
Create a `.env` file inside `frontend/` (see `frontend/.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### **Backend (`backend/.env`)**
Create a `.env` file inside `backend/` (see `backend/.env.example`):
```env
# Supabase PostgreSQL Configuration (Project: ughvlbsqdciytocgpkjc, Region: ap-southeast-1)
SPRING_DATASOURCE_URL=jdbc:postgresql://db.ughvlbsqdciytocgpkjc.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres.ughvlbsqdciytocgpkjc
SPRING_DATASOURCE_PASSWORD=your_supabase_db_password

# Supabase Auth & JWT Configuration
SUPABASE_JWT_SECRET=your_32_character_supabase_jwt_secret
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Spring Boot Server Port
SERVER_PORT=8080
```

---

## ⚡ Quick Start Guide & Execution Commands

### **Prerequisites**
- **Node.js**: v18+ (verified v24.19.0)
- **Java JDK**: 17+ (verified OpenJDK 17)
- **Maven**: 3.8+ (or Maven command line)

---

### **1. Running the Frontend (React Vite)**

Open terminal, navigate to `frontend/`, install dependencies and launch Vite development server:

```powershell
cd local-farmers-marketplace/frontend
npm install
npm run dev
```

The frontend will be running at: `http://localhost:5173`

---

### **2. Running the Backend (Spring Boot REST API)**

Open a separate terminal, navigate to `backend/`, compile and run Spring Boot:

```powershell
cd local-farmers-marketplace/backend
mvn spring-boot:run
```

The backend REST API will start on port `8080`.

---

### **3. Verifying Health Check API Endpoint**

Test the REST API health endpoint in terminal or browser:

```powershell
curl http://localhost:8080/api/health
```

Expected JSON Response (`200 OK`):
```json
{
  "status": "UP",
  "message": "Farmers Marketplace API is running"
}
```

---

## 👥 User Roles Architecture (Phase 1 Baseline)

1. **CUSTOMER**: Browse local harvests, manage shopping cart, place orders, write reviews.
2. **FARMER**: Create/update crop listings, set stock quantities & pricing, track incoming orders.
3. **ADMIN**: Platform overview, user role assignment, farmer verification, API health monitoring.

---

## 🌿 Phase 1 Verification Summary

- [x] React frontend builds cleanly with zero compilation warnings/errors (`npm run build`).
- [x] Responsive agricultural UI landing page with Hero section, Categories, How It Works, and Benefits.
- [x] Role portal placeholders for Customer, Farmer, and Admin dashboards.
- [x] Axios central API configuration connected to backend health endpoint.
- [x] Spring Boot Maven application compiles cleanly without errors.
- [x] `GET /api/health` REST endpoint operational and returning `{"status": "UP", "message": "Farmers Marketplace API is running"}`.
- [x] Environment variable configuration templates created for Supabase integration.

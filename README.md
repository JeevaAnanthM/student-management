# Student Registration & Login System with JWT and Admin Dashboard

A full-stack, enterprise-grade web application with role-based access control (`STUDENT` and `ADMIN`), stateless JWT authentication, password hashing with BCrypt, and a PostgreSQL database.

---

## 1. System Architecture & How Technologies Work Together

```
   ┌────────────────────────────────────────────────────────┐
   │                  React JS + Vite (Port 5173)           │
   │  - Bootstrap 5 + Custom CSS Responsive Portals         │
   │  - React Router DOM Protected Routes                   │
   │  - Axios with JWT Interceptors                         │
   └──────────────────────────┬─────────────────────────────┘
                              │
               HTTP / REST API (JSON + Bearer JWT)
                              │
   ┌──────────────────────────▼─────────────────────────────┐
   │             Spring Boot 3.3.4 (Port 8080)              │
   │  - SecurityFilterChain: Stateless & CORS               │
   │  - JwtAuthenticationFilter: Signature & Role Check     │
   │  - Layered Architecture: Controller -> Service -> Repo │
   │  - BCryptPasswordEncoder for Password Hashing          │
   │  - Startup Admin Seeder via Environment Variables      │
   └──────────────────────────┬─────────────────────────────┘
                              │
                        JDBC Connection
                              │
   ┌──────────────────────────▼─────────────────────────────┐
   │                PostgreSQL 14+ (Port 5432)              │
   │  - Database: student_db                                │
   │  - Table: students (with email UNIQUE & role CHECK)    │
   └────────────────────────────────────────────────────────┘
```

1. **User Registration (`STUDENT` Only)**:
   - User submits `name`, `email`, `password`, `confirmPassword`.
   - Frontend validates email format, 8-character password length, and matching confirmation.
   - Spring Boot receives `POST /api/register`.
   - Backend guarantees role is hardcoded to `'STUDENT'`. User cannot override or escalate privileges.
   - Password is encrypted using `BCryptPasswordEncoder` (10 rounds salt).
   - Record is stored in PostgreSQL `students` table.
   - Signed JWT is issued with claims: `sub` (email), `role` (`STUDENT`), `name`, `id`.

2. **Login & JWT Authentication**:
   - Both Student and Admin authenticate through `POST /api/login`.
   - Spring Security `AuthenticationManager` verifies credentials against stored BCrypt hashes.
   - If valid, a signed HMAC-SHA256 JWT is generated and returned with user profile metadata.
   - Frontend stores the JWT in `localStorage` and attaches it via Axios interceptors on subsequent requests: `Authorization: Bearer <token>`.

3. **Role-Based Authorization & Admin Security**:
   - Exactly **one authorized administrator account** is configured via backend environment variables (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
   - On startup, `AdminInitializer` checks if the admin account exists in `students`. If not, it safely creates it with `role = 'ADMIN'`. It never overwrites or resets existing data.
   - All admin endpoints (`/api/admin/**`) are strictly guarded on the backend by `@PreAuthorize("hasRole('ADMIN')")`.
   - If a student token attempts to call `/api/admin/**`, Spring Security denies access and returns **HTTP 403 Forbidden**.
   - If an unauthenticated request attempts to call any protected endpoint, Spring Security returns **HTTP 401 Unauthorized**.
   - Student profile endpoint `GET /api/students/me` extracts user identity strictly from the verified JWT claims (`Authentication.getName()`), preventing any student from accessing another user's profile.

---

## 2. Project Directory Structure

```
student-auth-app/
├── .gitignore
├── README.md
├── database/
│   ├── README.md
│   └── schema.sql
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/studentauth/
│           │   ├── StudentAuthApplication.java
│           │   ├── config/
│           │   │   ├── AdminInitializer.java
│           │   │   └── SecurityConfig.java
│           │   ├── controller/
│           │   │   ├── AdminController.java
│           │   │   ├── AuthController.java
│           │   │   └── StudentController.java
│           │   ├── dto/
│           │   │   ├── AdminStatsResponse.java
│           │   │   ├── AuthResponse.java
│           │   │   ├── ErrorResponse.java
│           │   │   ├── LoginRequest.java
│           │   │   ├── RegisterRequest.java
│           │   │   └── StudentProfileResponse.java
│           │   ├── entity/
│           │   │   └── Student.java
│           │   ├── exception/
│           │   │   ├── DuplicateEmailException.java
│           │   │   ├── GlobalExceptionHandler.java
│           │   │   ├── PasswordMismatchException.java
│           │   │   └── ResourceNotFoundException.java
│           │   ├── repository/
│           │   │   └── StudentRepository.java
│           │   ├── security/
│           │   │   ├── CustomAccessDeniedHandler.java
│           │   │   ├── CustomAuthenticationEntryPoint.java
│           │   │   ├── CustomUserDetails.java
│           │   │   ├── CustomUserDetailsService.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   └── JwtUtils.java
│           │   └── service/
│           │       ├── AuthService.java
│           │       ├── StudentService.java
│           │       └── impl/
│           │           ├── AuthServiceImpl.java
│           │           └── StudentServiceImpl.java
│           └── resources/
│               └── application.properties
└── frontend/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── AlertMessage.jsx
        │   ├── LoadingSpinner.jsx
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── AdminDashboardPage.jsx
        │   ├── AdminLoginPage.jsx
        │   ├── NotFoundPage.jsx
        │   ├── StudentDashboardPage.jsx
        │   └── StudentRegisterPage.jsx
        ├── routes/
        │   ├── AppRoutes.jsx
        │   └── ProtectedRoute.jsx
        ├── services/
        │   ├── adminService.js
        │   ├── api.js
        │   ├── authService.js
        │   └── studentService.js
        └── utils/
            ├── formatDate.js
            └── jwtUtils.js
```

---

## 3. Database Setup Instructions (PostgreSQL)

### Step 1: Create Database
In PowerShell or Windows Command Prompt:
```powershell
$env:PGPASSWORD = "your_postgres_password"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE student_db;"
```

### Step 2: Execute Schema Script
Run the `schema.sql` script to create the table with constraints and indexes:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d student_db -f "C:\student_managemant2\student-auth-app\database\schema.sql"
```

---

## 4. Environment Configuration

### Backend Environment Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env` and configure:
```env
# PostgreSQL Database Connection
DB_URL=jdbc:postgresql://localhost:5432/student_db
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

# JWT Secret (HMAC-SHA256, 32+ characters)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION_MS=86400000

# Dedicated System Administrator Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345

# Allowed Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Configuration (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 5. Build and Run Commands (Windows)

### Terminal 1: Run Spring Boot Backend
```powershell
cd C:\student_managemant2\student-auth-app\backend
mvn clean compile
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`.

### Terminal 2: Run React Frontend
```powershell
cd C:\student_managemant2\student-auth-app\frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 6. Testing the APIs with Postman / cURL

### 1. Student Registration
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/register`
- **Body** (JSON):
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```
- **Response**: `201 Created` with token, student info, and `role: "STUDENT"`.

### 2. Student Login
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/login`
- **Body** (JSON):
```json
{
  "email": "jane@example.com",
  "password": "Password@123"
}
```
- **Response**: `200 OK` with JWT token.

### 3. Student Profile Retrieval
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/students/me`
- **Headers**: `Authorization: Bearer <STUDENT_JWT_TOKEN>`
- **Response**: `200 OK` with profile (ID, name, email, role, registration date).

### 4. Admin Login
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/login`
- **Body** (JSON):
```json
{
  "email": "admin@example.com",
  "password": "Admin@12345"
}
```
- **Response**: `200 OK` with JWT token and `role: "ADMIN"`.

### 5. Admin Dashboard Student List
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/students`
- **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Response**: `200 OK` with array of registered students.

### 6. Admin Search Students
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/students?search=Jane`
- **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`

### 7. Security Enforcement: Student Calling Admin Endpoint
- **Method**: `GET`
- **URL**: `http://localhost:8080/api/admin/students`
- **Headers**: `Authorization: Bearer <STUDENT_JWT_TOKEN>`
- **Response**: `403 Forbidden` (`Access Denied: You do not have permission to access this resource`).

---

## 7. Troubleshooting & Common Errors

| Error | Root Cause | Solution |
|---|---|---|
| `Connection refused: localhost:5432` | PostgreSQL service not running | Start the `postgresql-x64-18` service via `net start postgresql-x64-18` or Services panel. |
| `FATAL: password authentication failed` | Incorrect DB password in `backend/.env` | Update `DB_PASSWORD` in `backend/.env` with your PostgreSQL password. |
| `CORS Error: Access-Control-Allow-Origin` | Frontend origin not matched in backend | Ensure `FRONTEND_URL=http://localhost:5173` is set in `backend/.env`. |
| `JWT Expired / Invalid signature` | Expired token or mismatched `JWT_SECRET` | Log out and log in again to generate a fresh signed token. |
| `403 Forbidden on /api/admin/**` | Accessing admin endpoints with student role | Expected security behavior. Only `admin@example.com` can access admin routes. |
| `Port 8080 or 5173 already in use` | Existing process running | Terminate old processes using `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess`. |

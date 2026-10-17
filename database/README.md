# PostgreSQL Database Setup Guide (`student_db`)

This guide explains how to set up the PostgreSQL database and execute the schema script for the Student Registration and Login application.

---

## 1. Prerequisites

- PostgreSQL 14 or newer installed and running (default port: `5432`).
- A PostgreSQL user (typically `postgres`).

---

## 2. Option A: Setup using Command Line (`psql`)

### Step 1: Open Terminal / PowerShell
On Windows, you can use PowerShell or the PostgreSQL SQL Shell (`psql`).

### Step 2: Connect to PostgreSQL as superuser
```powershell
# Set PostgreSQL bin in PATH or execute psql directly:
# e.g., & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres
psql -U postgres
```
Enter your PostgreSQL password when prompted.

### Step 3: Create the `student_db` database
```sql
CREATE DATABASE student_db;
```

### Step 4: Connect to `student_db`
```sql
\c student_db;
```

### Step 5: Execute the `schema.sql` script
Run the script using the `\i` command with forward slashes:
```sql
\i 'C:/student_managemant2/student-auth-app/database/schema.sql'
```

Alternatively, run the script directly from PowerShell in a single command:
```powershell
$env:PGPASSWORD = "your_postgres_password"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d student_db -f "C:\student_managemant2\student-auth-app\database\schema.sql"
```

### Step 6: Verify the Table
```sql
\dt
\d students
```

---

## 3. Option B: Setup using pgAdmin 4

1. Open **pgAdmin 4** and log in with your master password.
2. Under **Servers** > **PostgreSQL 18** (or your version):
   - Right-click **Databases** > **Create** > **Database...**
   - Database name: `student_db`
   - Click **Save**.
3. Select `student_db` from the left sidebar tree.
4. Open the **Query Tool** (Tools > Query Tool).
5. Open the `schema.sql` file (File > Open > browse to `schema.sql`) or copy and paste its contents into the editor.
6. Click the **Execute/Run** button (lightning bolt / `F5`).
7. Expand `student_db` > **Schemas** > **public** > **Tables** and verify `students` is listed.

---

## 4. Table Schema Overview

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY`, Identity | Unique student ID |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full name of the student |
| `email` | `VARCHAR(150)` | `NOT NULL`, `UNIQUE` | Unique email address |
| `password` | `VARCHAR(255)` | `NOT NULL` | Securely hashed BCrypt password |
| `role` | `VARCHAR(20)` | `NOT NULL`, Default `'STUDENT'` | User role (`STUDENT` or `ADMIN`) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default `CURRENT_TIMESTAMP` | Account creation timestamp |

---

## 5. Security Notes

- **Never create or insert admin accounts with plaintext passwords.**
- The application automatically initializes the administrator account at Spring Boot startup using the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables, hashed securely with BCrypt.

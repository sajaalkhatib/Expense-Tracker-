# 💰 Expense Tracker

A full-stack expense tracking application built with **Node.js, Express, PostgreSQL**, and a responsive frontend.

---

## 🗺️ Roadmap & Progress Checklist

### ✅ Phase 1: Backend API & Database (Completed)
- [x] **Database Setup:** Created `expense_tracker` database in PostgreSQL and initialized tables using `schema.sql`.
- [x] **Environment Configuration:** Configured `.env` file for secure PostgreSQL connection (protected via `.gitignore`).
- [x] **Security:** All SQL queries use parameterized placeholders (`$1`, `$2`, etc.) to prevent SQL Injection.
- [x] **Data Serialization:** Corrected type conversions (`amount::float8` and `to_char(date, 'YYYY-MM-DD') AS date`).
- [x] **Validation & Error Handling:** Implemented validation for category enum, positive amounts, valid date format, and ID validation (returning 400 for bad data, 404 for missing items).
- [x] **CORS:** Configured CORS to enable seamless frontend communication.
- [x] **Testing:** Verified and tested all 5 endpoints using Thunder Client.

### ⏳ Phase 2: Frontend Integration (Upcoming)
- [ ] Connect HTML/CSS/JS frontend to the backend API.
- [ ] Render dynamic expense table and summary cards.
- [ ] Implement Add, Edit, Delete, and Category Filtering in UI.
- [ ] Add loading spinners and user-friendly error alerts.

---

## 🚀 API Endpoints Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Status Code (Success) | Error Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/expenses` | Returns a list of all expenses | `200 OK` | `500` |
| **GET** | `/api/expenses/:id` | Returns details of a specific expense | `200 OK` | `404`, `500` |
| **POST** | `/api/expenses` | Creates a new expense | `201 Created` | `400`, `500` |
| **PUT** | `/api/expenses/:id` | Updates an existing expense | `200 OK` | `400`, `404`, `500` |
| **DELETE** | `/api/expenses/:id` | Deletes an expense | `200 OK` | `404`, `500` |

---

## 📋 Allowed Categories & Data Validation Rules

- **Allowed Categories:** `Food`, `Transport`, `Bills`, `Entertainment`, `Other`
- **Amount:** Must be a positive number greater than `0`.
- **Date:** Must be in `YYYY-MM-DD` format.
- **Title:** Required non-empty string (up to 100 characters).

### Sample Request Body (POST / PUT)
```json
{
  "title": "Grocery Shopping",
  "amount": 42.50,
  "category": "Food",
  "date": "2026-03-01"
}
```

---

## 🛠️ Getting Started & Local Setup

### 1. Database Setup
1. Open **pgAdmin** (or `psql`) and create a database named `expense_tracker`.
2. Run the provided [`backend/schema.sql`](backend/schema.sql) script to create the `expenses` table and insert initial sample data.

### 2. Configure Environment Variables
Inside the `backend/` folder, copy `.env.example` to `.env` and set your credentials:
```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

### 3. Install Dependencies & Start the Server
```bash
cd backend
npm install
node server.js
```
The server will start listening on `http://localhost:3000`.
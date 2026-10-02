# 💰 Expense Tracker

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

A full-stack, responsive expense tracking web application designed to help users record, manage, filter, analyze, and export daily personal expenses. Built with a robust **Node.js & Express** RESTful API, **PostgreSQL** database, and a dynamic **Bootstrap 5** frontend.

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🗺️ Project Status & Roadmap](#️-project-status--roadmap)
- [📂 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started & Local Setup](#-getting-started--local-setup)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone the Repository](#2-clone-the-repository)
  - [3. Database Setup](#3-database-setup)
  - [4. Backend Configuration & Launch](#4-backend-configuration--launch)
  - [5. Launch the Frontend](#5-launch-the-frontend)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [📸 API Testing & Verification](#-api-testing--verification)
- [📋 Data Validation Rules](#-data-validation-rules)
- [🗄️ Database Schema](#️-database-schema)
- [📄 License](#-license)

---

## ✨ Key Features

### 🖥️ Frontend & User Experience
- **📊 Real-time Dashboard Summary:** Instant dynamic calculation of **Total Amount Spent**, **Total Transactions Count**, and **Highest Expense Recorded**.
- **📝 Complete Expense CRUD:**
  - **Create:** Add expenses with title, category, positive amount, and date.
  - **Read:** Tabular listing with date formatting and category color badges.
  - **Update:** Edit existing transactions in a pre-filled Bootstrap modal dialog.
  - **Delete:** Remove transactions with safety confirmation prompts.
- **🔍 Advanced Real-time Search & Filtering:**
  - Search by expense title with live filtering on keystroke.
  - Filter by category (`Food`, `Transport`, `Bills`, `Entertainment`, `Other`).
  - Filter by month (`YYYY-MM`) using date pickers.
  - One-click filter reset button.
- **📥 CSV Data Export:** Export your entire expense history to a `.csv` file with proper character escaping.
- **⚡ Deep Linking & URL State Synchronization:** Supports browser navigation and direct URLs with query parameters (`?edit=<id>`, `?delete=<id>`), retaining seamless back/forward navigation.
- **🔄 Interactive UI Feedback:** Bootstrap loading spinners during asynchronous requests, dismissible success/error alerts, and empty-state placeholders.

### ⚙️ Backend & API Security
- **🛡️ SQL Injection Protection:** 100% parameterized queries (`$1`, `$2`, ...) across all database operations.
- **🔒 Strict Server-Side Validation:** Validates required JSON payload fields, title string constraints, positive numerical amounts, category enums, and `YYYY-MM-DD` date formats.
- **🌐 Cross-Origin Resource Sharing (CORS):** Seamless and secure communication between the frontend client and backend API.
- **⚡ RESTful Architecture:** Standardized HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

---

## 🗺️ Project Status & Roadmap

### ✅ Phase 1: Backend API & Database (Completed)
- [x] Initialized PostgreSQL database with relational `CHECK` constraints.
- [x] Implemented Express REST API routes with `pg.Pool` connection pooling.
- [x] Built strict payload validation and standardized error handling.
- [x] Tested and verified all endpoints with Thunder Client.

### ✅ Phase 2: Frontend Integration (Completed)
- [x] Modern responsive UI with Bootstrap 5 and Bootstrap Icons.
- [x] Connected frontend via Fetch API to backend endpoints.
- [x] Real-time summary dashboard cards.
- [x] Search, category filter, and monthly filter controls.
- [x] Bootstrap modal for updating existing expenses.
- [x] CSV export functionality with comma/quote escaping.
- [x] URL query parameter handling (`?edit=`, `?delete=`) and `popstate` support.
- [x] Async loading spinners and user alert messages.

### 🔮 Phase 3: Future Enhancements (Ideas)
- [ ] User authentication and authorization (JWT / bcrypt).
- [ ] Visual analytics charts (Chart.js / ApexCharts) by category breakdown.
- [ ] Monthly budget limit alerts and notifications.

---

## 📂 Project Structure

```
Expense-Tracker/
├── API Endpoints/                  # Verified API test screenshots
│   ├── 400 Bad Request.png        # Validation error test
│   ├── Delete.png                 # DELETE expense test
│   ├── get.png                    # GET all expenses test
│   ├── get_id.png                 # GET expense by ID test
│   ├── post.png                   # POST create expense test
│   └── put.png                    # PUT update expense test
├── backend/                        # Node.js & Express REST API
│   ├── .env.example               # Environment variables template
│   ├── db.js                      # PostgreSQL connection pool configuration
│   ├── package.json               # Backend npm dependencies and scripts
│   ├── schema.sql                 # PostgreSQL table definition & sample seed data
│   └── server.js                  # Express server, middleware, routes, validation
├── frontend/                       # Responsive Client Application
│   ├── css/
│   │   └── style.css              # Custom styling, grid layout, summary cards
│   ├── js/
│   │   └── app.js                 # API calls, DOM manipulation, filters, CSV export
│   └── index.html                 # Main dashboard, modal, form, and table layout
├── .gitignore                      # Git ignored files (.env, node_modules)
├── LICENSE                        # ISC License
├── package.json                   # Root package metadata
└── README.md                      # Project documentation
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+ Fetch API), Bootstrap 5.3, Bootstrap Icons |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | PostgreSQL, `pg` (Node-Postgres connection pool) |
| **Tools & Testing** | Thunder Client, VS Code, Git & GitHub, pgAdmin |

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (version 14+)
- A package manager (`npm` comes bundled with Node.js)

---

### 2. Clone the Repository
```bash
git clone https://github.com/sajaalkhatib/Expense-Tracker-.git
cd Expense-Tracker-
```

---

### 3. Database Setup
1. Open **pgAdmin** or terminal `psql`:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
2. Run the database schema script [`backend/schema.sql`](backend/schema.sql) against the `expense_tracker` database to create the table and seed initial rows:
   ```bash
   psql -U postgres -d expense_tracker -f backend/schema.sql
   ```

---

### 4. Backend Configuration & Launch
1. Navigate into the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create your `.env` configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*
3. Edit `.env` with your PostgreSQL credentials:
   ```env
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=expense_tracker
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the backend server:
   ```bash
   npm start
   # or
   node server.js
   ```
   The backend will be running at `http://localhost:3000`.

---

### 5. Launch the Frontend
You can run the frontend in any of the following ways:
- **VS Code Live Server:** Right-click [`frontend/index.html`](frontend/index.html) and select **Open with Live Server**.
- **Directly in Browser:** Double-click [`frontend/index.html`](frontend/index.html) to open it in your favorite browser.
- **Local HTTP Server:**
  ```bash
  npx serve frontend
  ```

---

## ⚙️ Environment Variables

The backend relies on the following environment variables defined in `backend/.env`:

| Variable | Description | Default Example |
| :--- | :--- | :--- |
| `PORT` | Port the Express server listens on | `3000` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_HOST` | Database host | `localhost` |
| `DB_NAME` | PostgreSQL database name | `expense_tracker` |
| `DB_PASSWORD` | PostgreSQL user password | `your_password` |
| `DB_PORT` | PostgreSQL port | `5432` |

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Status Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Health check and welcome message | `200 OK` | - |
| **GET** | `/api/expenses` | Retrieve all expenses ordered by date (DESC) | `200 OK` | `500` |
| **GET** | `/api/expenses/:id` | Retrieve a single expense by ID | `200 OK` | `400`, `404`, `500` |
| **POST** | `/api/expenses` | Create a new expense record | `201 Created` | `400`, `500` |
| **PUT** | `/api/expenses/:id` | Update an existing expense record | `200 OK` | `400`, `404`, `500` |
| **DELETE** | `/api/expenses/:id` | Delete an expense by ID | `200 OK` | `400`, `404`, `500` |

---

### Sample Request & Response Payloads

#### `POST /api/expenses`
**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 42.50,
  "category": "Food",
  "date": "2026-03-01"
}
```

**Response (`201 Created`):**
```json
{
  "id": 8,
  "title": "Grocery Shopping",
  "amount": 42.5,
  "category": "Food",
  "date": "2026-03-01"
}
```

---

#### `PUT /api/expenses/:id`
**Request Body:**
```json
{
  "title": "High-speed Internet",
  "amount": 35.00,
  "category": "Bills",
  "date": "2026-03-05"
}
```

**Response (`200 OK`):**
```json
{
  "id": 7,
  "title": "High-speed Internet",
  "amount": 35,
  "category": "Bills",
  "date": "2026-03-05"
}
```

---

## 📸 API Testing & Verification

All API routes have been tested and verified using **Thunder Client**.

<details open>
<summary><b>Click to expand / collapse endpoint test screenshots</b></summary>
<br>

| Scenario / Route | Test Screenshot |
| :--- | :--- |
| **GET All Expenses** (`/api/expenses`) | ![GET Expenses](API%20Endpoints/get.png) |
| **GET Single Expense** (`/api/expenses/:id`) | ![GET Single Expense](API%20Endpoints/get_id.png) |
| **POST Create Expense** (`/api/expenses`) | ![POST Create Expense](API%20Endpoints/post.png) |
| **PUT Update Expense** (`/api/expenses/:id`) | ![PUT Update Expense](API%20Endpoints/put.png) |
| **DELETE Expense** (`/api/expenses/:id`) | ![DELETE Expense](API%20Endpoints/Delete.png) |
| **Validation Error (400 Bad Request)** | ![400 Bad Request](API%20Endpoints/400%20Bad%20Request.png) |

</details>

---

## 📋 Data Validation Rules

The API enforces strict data integrity rules before executing any database query:

| Field | Rule / Type | Constraints |
| :--- | :--- | :--- |
| `id` | Positive integer | Must be a valid positive integer string in URL parameter |
| `title` | String | Required, non-empty, trimmed, maximum 100 characters |
| `amount` | Number | Required, numeric, strictly greater than `0` |
| `category` | String | Must be one of: `Food`, `Transport`, `Bills`, `Entertainment`, `Other` |
| `date` | String | Required ISO format matching regex `^\d{4}-\d{2}-\d{2}$` (`YYYY-MM-DD`) |

---

## 🗄️ Database Schema

The database table definition from [`backend/schema.sql`](backend/schema.sql):

```sql
CREATE TABLE expenses (
  id       SERIAL PRIMARY KEY,
  title    VARCHAR(100)  NOT NULL CHECK (btrim(title) <> ''),
  amount   NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  category VARCHAR(50)   NOT NULL CHECK (category IN ('Food', 'Transport', 'Bills', 'Entertainment', 'Other')),
  date     DATE          NOT NULL
);
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
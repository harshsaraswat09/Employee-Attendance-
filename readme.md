# 🕐 Employee Attendance Management System

A full-stack web application for managing employee attendance, overtime, and reporting — with role-based access control for **Employees**, **Managers**, and **Admins**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Role-Based Access](#-role-based-access)
- [Authentication Flow](#-authentication-flow)
- [Bug Fixes Applied](#-bug-fixes-applied)

---

## ✨ Features

| Feature | Employee | Manager | Admin |
|---------|----------|---------|-------|
| Login / Register | ✅ | ✅ | ✅ |
| Punch In / Out | ✅ | ❌ | ❌ |
| View My Attendance | ✅ | ❌ | ❌ |
| View Team Attendance | ❌ | ✅ | ✅ |
| View All Attendance | ❌ | ❌ | ✅ |
| Validate Attendance | ❌ | ✅ | ✅ |
| Request Overtime | ✅ | ❌ | ❌ |
| Review Overtime Requests | ❌ | ✅ | ✅ |
| Attendance Reports | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI framework
- **Redux Toolkit** — Global state management
- **React Router DOM v7** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS v4** — Utility-first styling
- **Lucide React** — Icon library
- **Vite** — Build tool & dev server

### Backend
- **Node.js + Express 5** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT (jsonwebtoken)** — Authentication tokens
- **bcryptjs** — Password hashing
- **express-validator** — Request validation
- **Morgan** — HTTP request logging
- **dotenv** — Environment variable management

---

## 📁 Project Structure

```
Employee-Attendance/
├── backend/
│   ├── server.js                    # Entry point
│   └── src/
│       ├── app.js                   # Express app setup
│       ├── config/
│       │   ├── config.js            # App configuration
│       │   └── database.js          # MongoDB connection
│       ├── controller/
│       │   ├── auth.controller.js   # Register, Login, GetMe
│       │   ├── attendance.controller.js
│       │   ├── overtime.controller.js
│       │   └── user.controller.js
│       ├── middleware/
│       │   └── auth.middleware.js   # JWT auth + role guard
│       ├── model/
│       │   ├── user.model.js        # User schema
│       │   ├── attendance.model.js  # Attendance schema
│       │   └── overtime.model.js    # Overtime schema
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── attendance.routes.js
│       │   ├── overtime.routes.js
│       │   └── user.routes.js
│       └── validator/
│           ├── auth.validator.js
│           ├── attendance.validator.js
│           └── overtime.validator.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── app/
        │   ├── App.jsx              # Root component, token restore on reload
        │   ├── app.routes.jsx       # Route definitions + ProtectedRoute wrappers
        │   └── app.store.js         # Redux store
        └── features/
            ├── auth/
            │   ├── components/
            │   │   └── ProtectedRoute.jsx   # Role-based route guard
            │   ├── hook/useAuth.js          # Login, Register, GetMe, Logout
            │   ├── pages/
            │   │   ├── LoginPage.jsx
            │   │   └── RegisterPage.jsx
            │   ├── service/auth.api.js      # Axios calls to /auth
            │   └── store/auth.slice.js      # user, token, loading, error state
            ├── attendance/
            │   ├── hook/useAttendance.js
            │   ├── pages/
            │   │   ├── PunchPage.jsx
            │   │   ├── MyAttendancePage.jsx
            │   │   ├── TeamAttendancePage.jsx
            │   │   ├── AllAttendancePage.jsx
            │   │   └── ReportPage.jsx
            │   ├── service/attendance.api.js
            │   └── store/attendance.slice.js
            ├── dashboard/
            │   ├── hook/useUser.js
            │   ├── pages/
            │   │   ├── EmployeeDashboard.jsx
            │   │   ├── ManagerDashboard.jsx
            │   │   └── AdminDashboard.jsx
            │   ├── service/user.api.js
            │   └── store/user.slice.js
            └── overtime/
                ├── hook/useOvertime.js
                ├── pages/
                │   ├── OvertimePage.jsx
                │   └── PendingOvertimePage.jsx
                ├── service/overtime.api.js
                └── store/overtime.slice.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/harshsaraswat09/Employee-Attendance-.git
cd Employee-Attendance-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#-environment-variables)).

```bash
# Start in development mode (with auto-restart)
npm run dev

# Start in production mode
npm start
```

Backend runs on **http://localhost:5000** by default.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

Frontend runs on **http://localhost:5173** by default.

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Port for the Express server | Optional (default: 5000) |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | ✅ Yes |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. `7d`, `24h`) | Optional |
| `NODE_ENV` | `development` or `production` | Optional |

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Base URL of the backend API | ✅ Yes |

---

## 📡 API Reference

All protected routes require the `Authorization: Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/login` | Public | Login and get JWT token |
| `GET` | `/me` | Protected | Get current logged-in user |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee",
  "department": "Engineering",
  "managerId": "optional_manager_object_id"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Attendance — `/api/attendance`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/punch-in` | Employee | Record punch-in time |
| `POST` | `/punch-out` | Employee | Record punch-out time |
| `GET` | `/my` | Employee | Get own attendance records |
| `GET` | `/team` | Manager, Admin | Get team attendance |
| `GET` | `/all` | Admin | Get all attendance records |
| `PATCH` | `/:id/validate` | Manager, Admin | Validate an attendance record |
| `GET` | `/report` | All | Get attendance report |

---

### Overtime — `/api/overtime`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `POST` | `/request` | Employee | Submit an overtime request |
| `GET` | `/my` | Employee | Get own overtime requests |
| `GET` | `/pending` | Manager, Admin | Get pending overtime requests |
| `PATCH` | `/:id/review` | Manager, Admin | Approve or reject overtime |

---

### Users — `/api/users`

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin | Get all users |
| `GET` | `/:id` | Admin | Get user by ID |

---

## 👥 Role-Based Access

The system has three roles:

### 🟦 Employee
- Can punch in and punch out
- Can view their own attendance history
- Can submit overtime requests
- Can view their own overtime status
- Dashboard: `EmployeeDashboard`
- Route: `/dashboard/employee`

### 🟨 Manager
- Can view attendance of their team
- Can validate/approve attendance records
- Can view and review pending overtime requests
- Dashboard: `ManagerDashboard`
- Route: `/dashboard/manager`

### 🟥 Admin
- Full access to all features
- Can view all employees' attendance
- Can validate attendance and review overtime
- Can manage users
- Dashboard: `AdminDashboard`
- Route: `/dashboard/admin`

---

## 🔄 Authentication Flow

```
User fills Login form
        ↓
POST /api/auth/login
        ↓
Backend returns { token, user }
        ↓
Token saved to localStorage
User saved to Redux store
        ↓
Redirect to role-based dashboard

--- On Page Reload ---

App.jsx mounts
        ↓
Check localStorage for token
        ↓
If token exists → GET /api/auth/me (with token)
        ↓
Backend validates token → returns user
        ↓
User restored to Redux store
ProtectedRoute allows access ✅

--- Token Missing / Expired ---

handleGetMe() fails
Token removed from localStorage
loading set to false
ProtectedRoute redirects to /login
```

---

## 🐛 Bug Fixes Applied

### Fix 1: Login session lost on page reload

**Problem:** Every time the page was refreshed, the user was redirected back to the `/login` page, even though they had previously logged in.

**Root Cause:** Three issues working together:

1. `auth.slice.js` had `loading: false` as the initial state. When the app reloaded, `ProtectedRoute` immediately saw `user: null` + `loading: false` and redirected to login — before `handleGetMe()` could finish fetching the user from the token.

2. `handleGetMe()` was not clearing the token from `localStorage` when the API call failed, so invalid/expired tokens could persist silently.

3. The response parsing in `handleGetMe()` was reading `response.data` incorrectly — the backend returns `{ success, data: user }`, so the user object is at `response.data.data`, not `response.data`.

**Files Changed:**

- `frontend/src/features/auth/store/auth.slice.js`
  - Changed `loading` initial state from `false` → `true`
  - This makes `ProtectedRoute` show a loading screen while the token is being verified, instead of immediately redirecting

- `frontend/src/features/auth/hook/useAuth.js`
  - Fixed `handleGetMe()` to correctly parse `response.data.data` for the user object
  - Added `localStorage.removeItem("token")` in the catch block so expired tokens are cleaned up
  - Fixed `handleRegister` and `handleLogin` to correctly destructure `response.data` (which is `{ success, data: { token, user } }`)

- `frontend/src/app/App.jsx`
  - Replaced raw `store.dispatch({ type: "auth/setLoading", payload: false })` with the properly imported `setLoading` action creator
  - Added import for `setLoading` from `auth.slice.js`

---

## 📦 Data Models

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "employee" | "manager" | "admin",
  department: String,
  managerId: ObjectId (ref: User),
  createdAt, updatedAt
}
```

### Attendance
```js
{
  employeeId: ObjectId (ref: User),
  date: Date,
  punchIn: Date,
  punchOut: Date,
  status: "present" | "absent" | "late",
  validated: Boolean,
  validatedBy: ObjectId (ref: User)
}
```

### Overtime
```js
{
  employeeId: ObjectId (ref: User),
  date: Date,
  hours: Number,
  reason: String,
  status: "pending" | "approved" | "rejected",
  reviewedBy: ObjectId (ref: User)
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
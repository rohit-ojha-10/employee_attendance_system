# Unified Employee Attendance & Productivity System

## Overview
This is a comprehensive full-stack solution designed to manage employee attendance, leave tracking, productivity monitoring, and access control. It features a modern, responsive UI and a robust backend API.

## Features
- **Authentication**: Secure user registration and login using JWT. Role-based access control (Admin vs. Employee).
- **Dashboard**: Interactive dashboard with quick stats and navigation.
- **Attendance**: 
  - "Punch In" and "Punch Out" functionality.
  - View personal attendance history.
  - Automatic work hour calculation.
- **Leave Management**:
  - Apply for different types of leaves (Sick, Casual, Earned).
  - View leave history and status (Pending, Approved, Rejected).
  - Admin interface to approve/reject leaves.
- **Productivity (Task Management)**:
  - Admin can assign tasks to employees.
  - Employees can view assigned tasks and update status (Pending, In Progress, Completed).
  - Visual indicators for task status.

## Tech Stack
- **Frontend**: React (Vite), CSS (Modern/Glassmorphism)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (optional, defaults provided in code for dev):
   ```env
   MONGO_URI=mongodb://localhost:27017/unified_employee_system
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Attendance
- `POST /api/attendance/checkin` - Punch In
- `POST /api/attendance/checkout` - Punch Out
- `GET /api/attendance/my-attendance` - Get user's attendance

### Leaves
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/my-leaves` - Get user's leaves
- `GET /api/leaves/all` - Get all leaves (Admin)
- `PUT /api/leaves/:id/status` - Update leave status (Admin)

### Tasks
- `POST /api/tasks` - Create task (Admin)
- `GET /api/tasks/my-tasks` - Get user's tasks
- `PUT /api/tasks/:id/status` - Update task status
- `GET /api/tasks/users` - Get list of users (Admin)

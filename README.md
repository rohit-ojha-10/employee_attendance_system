# Unified Employee Attendance & Productivity System

## Overview
This is a comprehensive full-stack solution designed to manage employee attendance, leave tracking, productivity monitoring, and access control. It features a modern, responsive UI, a robust backend API, and a .NET microservice for advanced analytics and rule evaluation.

## Features
- **Authentication**: Secure user registration and login using JWT. Role-based access control (Admin, HR, Employee).
- **Admin Panel**: Dedicated admin interface with system actions and monitoring.
- **Dashboard**: Interactive dashboard with quick stats, charts, and navigation.
- **Attendance**: 
  - "Punch In" and "Punch Out" functionality.
  - View personal attendance history.
  - Automatic work hour calculation.
  - Task hours tracking per attendance record.
- **Leave Management**:
  - Apply for different types of leaves (Sick, Casual, Earned).
  - View leave history and status (Pending, Approved, Rejected).
  - Admin/HR interface to approve/reject leaves.
- **Productivity (Task Management)**:
  - Admin can assign tasks to employees with project names.
  - Employees can view assigned tasks and update status (Pending, In Progress, Completed).
  - Timer functionality to log work hours per task.
  - Productivity score calculation.
  - Visual indicators for task status.
- **Rules Engine** (.NET Service):
  - Define custom access control rules.
  - Automated rule evaluation.
  - Alert generation for rule violations.
- **System Actions** (Admin Only):
  - Run reconciliation (detect attendance/leave conflicts).
  - Calculate productivity scores.
  - Evaluate access control rules.
  - View system alerts.

## Tech Stack
- **Frontend**: React (Vite), CSS (Modern/Glassmorphism)
- **Backend**: Node.js, Express.js
- **Microservice**: .NET Core (ASP.NET Core)
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

## Quick Start

### Prerequisites
- Node.js (v14+)
- .NET SDK (v8.0+)
- MongoDB (Local or Atlas)

### Easy Setup (Recommended)
Run all services with a single command:

**Windows (PowerShell):**
```powershell
.\start-all.ps1
```

**Windows (Command Prompt):**
```batch
start-all.bat
```

This will:
1. Seed the admin user
2. Start the backend server
3. Start the frontend development server
4. Start the .NET microservice

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:5000`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Application runs on `http://localhost:5173`

#### 3. .NET Service Setup
```bash
cd dotnet_service
dotnet run
```
Service runs on `http://localhost:5192`

#### 4. Seed Admin User
```bash
cd backend
node scripts/seedAdmin.js
```

## Default Credentials

### Admin Account
- **Email**: `admin@g.com`
- **Password**: `admin`

## Development Tools

### Seed Admin Script
Creates an admin user in the database.

**Location**: `backend/scripts/seedAdmin.js`

**How to run:**
```bash
cd backend
node scripts/seedAdmin.js
```

### Reset Test User Script
A utility script to quickly reset the database with a test user and generated data.

**What it does:**
1. Cleans up existing `test@example.com` user data
2. Creates new test user with password `password123`
3. Assigns 5 default tasks
4. Generates 7 days of historical attendance data

**How to run:**
```bash
cd backend
npm run reset-user
```

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
- `GET /api/leaves/all` - Get all leaves (Admin/HR)
- `PUT /api/leaves/:id/status` - Update leave status (Admin/HR)

### Tasks
- `POST /api/tasks` - Create task (Admin)
- `GET /api/tasks/my-tasks` - Get user's tasks
- `PUT /api/tasks/:id/status` - Update task status
- `PUT /api/tasks/:id/log-time` - Log time for task
- `GET /api/tasks/users` - Get list of users (Admin)

### Rules (Admin)
- `GET /api/rules` - Get all rules
- `POST /api/rules` - Create new rule
- `DELETE /api/rules/:id` - Delete rule

### Alerts
- `GET /api/alerts` - Get all alerts

### System Actions (Admin - via .NET Service)
- `POST /api/system/reconcile` - Run reconciliation
- `POST /api/system/calculate-productivity` - Calculate productivity scores
- `POST /api/system/evaluate-rules` - Evaluate access control rules
- `POST /api/system/run-all` - Run all system checks

## Project Structure

```
unified_employee_system/
├── backend/              # Node.js Express API
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── scripts/         # Utility scripts
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
├── dotnet_service/      # .NET Core microservice
│   ├── Controllers/     # API controllers
│   ├── Models/          # Data models
│   └── Services/        # Business logic
├── start-all.bat        # Windows batch startup script
└── start-all.ps1        # PowerShell startup script
```

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/unified_employee_system
JWT_SECRET=your_jwt_secret
PORT=5000
```

### .NET Service (appsettings.json)
```json
{
  "ConnectionStrings": {
    "MongoDbConnection": "mongodb://localhost:27017/unified_employee_system"
  }
}
```

## License
MIT


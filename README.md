<div align="center">

# 🚀 AssetFlow

### Enterprise Asset & Resource Management System

*A modern ERP platform for managing organizational assets, resources, employees, maintenance, and operations.*

---

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-black?logo=express)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

# 📖 Overview

AssetFlow is a **modern Enterprise Asset & Resource Management System (ERP)** designed to streamline how organizations manage physical assets, shared resources, employees, maintenance operations, audits, and asset allocation.

Traditional asset management often relies on spreadsheets, emails, or paper records, leading to misplaced assets, duplicate allocations, booking conflicts, and inefficient workflows.

AssetFlow centralizes all these operations into a single intelligent platform with **Role-Based Access Control (RBAC)**, ensuring transparency, accountability, and operational efficiency.

---

# 🎯 Problem Statement

Organizations managing hundreds or thousands of assets often face challenges such as:

- 📄 Manual spreadsheet tracking
- ❌ Duplicate asset allocation
- 🔍 Lost or misplaced assets
- 🛠 Delayed maintenance workflows
- 📅 Booking conflicts for shared resources
- 📊 Lack of analytics and reporting
- 🔐 Poor access control

AssetFlow eliminates these problems by providing a centralized ERP solution.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

- JWT Authentication
- Role-Based Access Control (RBAC)
- Secure Password Hashing
- Protected Routes
- Admin Seed Account
- Employee Signup Workflow

---

## 🏢 Organization Management

- Department Management
- Employee Directory
- Asset Categories
- Department Hierarchy
- Role Promotion
- User Activation / Deactivation

---

## 📦 Asset Management

- Asset Registration
- QR Code Generation
- Asset Tag Generation
- Asset Search & Filtering
- Warranty Tracking
- Purchase Details
- Asset Lifecycle Tracking
- Asset Status Management

---

## 🔄 Asset Allocation & Transfer

- Allocate Assets
- Return Assets
- Transfer Requests
- Approval Workflow
- Conflict Detection
- Allocation History
- Overdue Tracking

---

## 📅 Resource Booking

- Book Shared Resources
- Meeting Room Booking
- Vehicle Booking
- Equipment Reservation
- Calendar View
- Booking Conflict Prevention

---

## 🛠 Maintenance Management

- Raise Maintenance Requests
- Kanban Workflow
- Technician Assignment
- Status Tracking
- Maintenance Timeline
- Request History

---

## 📊 Analytics & Reporting

- Dashboard KPIs
- Asset Utilization
- Department Statistics
- Maintenance Trends
- Booking Analytics
- Export Ready

---

## 🔔 Notifications

- Booking Alerts
- Maintenance Updates
- Transfer Notifications
- Activity Logs
- Approval Notifications

---

# 👥 User Roles

| Role | Responsibilities |
|------|------------------|
| **Admin** | Organization management, reports, analytics, audits |
| **Asset Manager** | Asset registration, allocation, maintenance |
| **Department Head** | Department assets, approvals, booking |
| **Employee** | View assets, raise maintenance, booking resources |

---

# 🏗 System Architecture

```text
                        React Frontend
                               │
                               │
                   REST APIs (Express.js)
                               │
               JWT Authentication + RBAC
                               │
                      Prisma ORM
                               │
                           MySQL
```

---

# 🧩 Modules

| Module | Status |
|----------|--------|
| Authentication | ✅ |
| Dashboard | ✅ |
| Organization Setup | ✅ |
| Asset Management | ✅ |
| Asset Allocation & Transfer | ✅ |
| Resource Booking | ✅ |
| Maintenance Management | ✅ |
| Reports & Analytics | ✅ |
| Notifications | ✅ |

---

# ⚙️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- React Router
- React Hook Form
- Zod
- Axios
- TanStack Query
- Recharts
- Framer Motion

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt
- Multer

---

## Database

- MySQL

---

## Tools

- Git
- GitHub
- VS Code
- Prisma Studio
- Cloudinary
- Postman

---

# 📂 Project Structure

```text
AssetFlow

├── frontend
│   ├── modules
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── organization
│   │   ├── assets
│   │   ├── allocation
│   │   ├── booking
│   │   ├── maintenance
│   │   ├── reports
│   │   └── notifications
│   │
│   ├── shared
│   ├── layouts
│   └── services
│
├── backend
│   ├── modules
│   │   ├── auth
│   │   ├── organization
│   │   ├── assets
│   │   ├── allocation
│   │   ├── booking
│   │   ├── maintenance
│   │   ├── reports
│   │   └── notifications
│   │
│   ├── middleware
│   ├── prisma
│   └── utils
│
└── README.md
```

---

# 🗄 Database Schema

The application uses a relational MySQL database managed through Prisma ORM.

Main entities include:

- Users
- Departments
- Asset Categories
- Assets
- Asset Allocations
- Transfer Requests
- Resource Bookings
- Maintenance Requests
- Notifications

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/AssetFlow.git

cd AssetFlow
```

---

## Backend

```bash
cd backend

npm install
```

Create

```
.env
```

Run

```bash
npx prisma migrate dev

npx prisma db seed

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Default Admin Credentials

```text
Email

admin@assetflow.com

Password

Admin@123
```

---

# 📸 Screenshots

> Add screenshots of the following pages

- Login
- Dashboard
- Organization Setup
- Asset Management
- Asset Allocation
- Booking
- Maintenance
- Reports

---

# 📈 Workflow

```text
Employee Signup

↓

Admin Login

↓

Organization Setup

↓

Departments

↓

Categories

↓

Employees

↓

Asset Registration

↓

Asset Allocation

↓

Transfer / Return

↓

Maintenance

↓

Reports

↓

Analytics
```

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- Protected Routes
- Input Validation
- Secure Environment Variables

---

# 🌟 Future Enhancements

- AI-powered Asset Recommendation
- Predictive Maintenance
- QR Scanner Integration
- Mobile Application
- Email Notifications
- RFID Asset Tracking
- Multi-Organization Support
- Audit Automation
- OCR-based Asset Registration
- Voice Assistant

---

# 👨‍💻 Team

| Name | Role |
|------|------|
| Vedant Kolhapure | Full Stack Developer |
| Vrishabh | Full Stack Developer |

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are welcome.

Fork the repository, create a feature branch, commit your changes, and submit a Pull Request.

---

# 📄 License

This project was developed for the **IIM Bangalore Student Innovation & Product Summit (SIPS) Hackathon**.

For educational and demonstration purposes.

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Made with ❤️ by Team AssetFlow

</div>

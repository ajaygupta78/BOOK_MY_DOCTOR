# 🏥 BOOK MY DOCTOR
### Online Doctor Appointment Booking System
**A Full-Stack BCA Final Year Project**

[![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green?logo=flask)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4.x-646cff?logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📖 Overview

**BOOK MY DOCTOR** is a production-ready, multi-role healthcare appointment scheduling web application. It eliminates the friction of traditional phone/walk-in booking systems by providing a seamless digital experience for patients, doctors, and hospital administrators.

Built for a **BCA Final Year submission**, the project demonstrates real-world application of REST API design, relational database normalization, JWT authentication, and modern React UI development.

---

## ✨ Features

### 👤 Patient Portal
- Register / Login with secure bcrypt password hashing
- Browse and filter **doctors** by specialization, hospital, and city
- View doctor schedules and available time slots
- Book appointments with conflict-prevention logic
- Simulate payments with a **Razorpay-inspired overlay** (card entry, OTP, invoice)
- View appointment history with status badges (Pending, Approved, Rejected, Completed)
- Download/print simulated invoices

### 🩺 Doctor Portal
- View personal appointment queue in a command-center dashboard
- Approve or reject individual appointment requests
- Manage weekly schedule availability toggles
- View patient details per appointment

### 👑 Admin Control Center
- Analytics dashboard: total users, doctors, appointments, earnings
- Full CRUD management for hospitals, doctors, and users
- View all appointment records and payment transactions

### 🛡️ Security
- JWT-based stateless authentication (24-hour tokens)
- bcrypt password hashing with salt rounds
- Role-Based Access Control (RBAC) via custom middleware
- CORS configured for safe React-Flask communication

---

## 🏗️ Project Architecture

```
BOOK_MY_DOCTOR/
├── backend/                  # 🐍 Flask REST API
│   ├── app.py                # Application factory & auto-seeder
│   ├── config.py             # JWT, database & secret key config
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   └── database.py       # SQLAlchemy ORM models (10 tables)
│   ├── routes/               # API route blueprints
│   │   ├── auth.py           # /api/auth/*
│   │   ├── hospitals.py      # /api/hospitals/*
│   │   ├── doctors.py        # /api/doctors/*
│   │   ├── appointments.py   # /api/appointments/*
│   │   ├── payments.py       # /api/payments/*
│   │   └── admin.py          # /api/admin/*
│   └── middleware/
│       └── auth_middleware.py # JWT token_required decorator
├── frontend/                 # ⚛️ React SPA (Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx            # Router & layout orchestrator
│       ├── index.css          # Premium global styles
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state
│       ├── services/
│       │   └── api.js          # Axios instance + JWT interceptor
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── DoctorCard.jsx
│       │   └── HospitalCard.jsx
│       └── pages/ (15 pages)
│           ├── Home, About, Contact
│           ├── Login, Register, Profile
│           ├── HospitalSearch, DoctorSearch
│           ├── AppointmentBooking, Payment
│           ├── AppointmentHistory
│           ├── PatientDashboard, DoctorDashboard
│           ├── AdminDashboard, NotFound
├── database/
│   └── schema.sql             # Full MySQL schema + seed data
├── documentation/
│   ├── installation_guide.md  # Setup instructions
│   ├── api_docs.md            # REST API reference
│   ├── testing_guide.md       # Manual & API test cases
│   └── project_report.md      # Formal BCA project report
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ (LTS)
- npm

### 1. Clone / Extract the Project

```bash
cd "BOOK_MY_DOCTOR"
```

### 2. Start the Backend

```powershell
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Launch Flask API server (auto-creates & seeds database)
python app.py
```

Flask will start on **http://localhost:5000** and automatically:
- Create all database tables
- Seed hospitals, specializations, doctors, and test accounts

### 3. Start the Frontend

```powershell
# Open a new terminal and navigate to frontend
cd frontend

# Install Node packages
npm install

# Launch Vite development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Default Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@bookmydoctor.com` | `admin123` |
| Doctor | `dr.smith@bookmydoctor.com` | `password123` |
| Doctor | `dr.jane@bookmydoctor.com` | `password123` |
| Patient | `pat.jones@gmail.com` | `password123` |
| Patient | `pat.doe@gmail.com` | `password123` |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Installation Guide](documentation/installation_guide.md) | Full setup instructions for Windows/macOS/Linux |
| [API Documentation](documentation/api_docs.md) | All REST endpoints with request/response samples |
| [Testing Guide](documentation/testing_guide.md) | 30+ manual & API test cases |
| [Project Report](documentation/project_report.md) | Formal BCA report with ERD, DFD, and analysis |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| HTTP Client | Axios (with JWT interceptor) |
| Styling | Vanilla CSS + Bootstrap 5 (Glassmorphic design) |
| Typography | Google Fonts – Inter & Outfit |
| Backend | Python Flask 3.x |
| ORM | Flask-SQLAlchemy |
| Auth | PyJWT + bcrypt |
| Database | SQLite (default) / MySQL (production) |
| CORS | Flask-CORS |

---

## 📊 Database

The system defaults to **SQLite** for zero-setup local operation and automatically seeds all required data on first boot. To switch to MySQL production mode, update `backend/config.py` with your credentials. The full `database/schema.sql` can also be imported directly into MySQL Workbench.

---

## 🎓 Academic Information

- **Project Title**: BOOK MY DOCTOR – Online Doctor Appointment Booking System
- **Degree**: Bachelor of Computer Applications (BCA)
- **Academic Year**: 2025–2026

---

## 📄 License

This project is submitted for academic purposes under the MIT License.

---

*Made with ❤️ for BCA Final Year Project 2025–2026*

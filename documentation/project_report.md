# BOOK MY DOCTOR
## Online Doctor Appointment Booking System
### BCA Final Year Project Report

---

**Department of Computer Applications**  
Academic Year: 2025–2026  
Submitted By: [Your Name]  
Roll Number: [Your Roll Number]  
Guide: [Guide Name], [Designation]

---

## Table of Contents

1. [Certificate](#certificate)
2. [Declaration](#declaration)
3. [Abstract / Synopsis](#abstract--synopsis)
4. [Introduction](#introduction)
5. [Objectives](#objectives)
6. [Scope of the Project](#scope-of-the-project)
7. [System Requirements](#system-requirements)
8. [Feasibility Study](#feasibility-study)
9. [System Analysis](#system-analysis)
10. [System Design](#system-design)
    - [Data Flow Diagrams (DFD)](#data-flow-diagrams-dfd)
    - [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
    - [Database Schema](#database-schema)
11. [Technology Stack](#technology-stack)
12. [Module Description](#module-description)
13. [Implementation](#implementation)
14. [Testing](#testing)
15. [Screenshots](#screenshots)
16. [Conclusion & Future Enhancements](#conclusion--future-enhancements)
17. [Bibliography & References](#bibliography--references)

---

## Certificate

*This is to certify that the project titled **"BOOK MY DOCTOR – Online Doctor Appointment Booking System"** is a genuine and bonafide work done by [Student Name] bearing Roll No. [XXXX] in partial fulfillment of the requirements for the award of the **Bachelor of Computer Applications (BCA)** degree for the academic year 2025–2026.*

*This project was completed under the supervision of [Guide Name], [Designation], Department of Computer Applications.*

*Signature of Internal Guide: _______________*  
*Signature of HOD: _______________*  
*Seal of Institution*

---

## Declaration

*I, [Student Name], Roll No. [XXXX], hereby declare that the project titled **"BOOK MY DOCTOR"** submitted to [University Name] for the award of the degree of Bachelor of Computer Applications is my original work and has not been submitted for any other degree or examination at this university or any other institution.*

*All the information furnished in this report is true and complete to the best of my knowledge and belief.*

*Place: [City Name]*  
*Date: _______________*  
*Signature of Student: _______________*

---

## Abstract / Synopsis

**BOOK MY DOCTOR** is a full-stack web-based healthcare management system designed to bridge the communication gap between patients, doctors, and hospital administrators. The system eliminates the inefficiencies of traditional phone-based and walk-in appointment systems by providing an intelligent, real-time digital platform.

The application is structured around three primary user roles:
- **Patients** can register, search for doctors by specialization, view their schedules, book appointments, and simulate fee payments.
- **Doctors** can manage their availability schedules, view and process appointment requests (approve or reject), and track their patient history.
- **Administrators** gain a comprehensive analytics dashboard that provides real-time visibility into earnings, appointment trends, registered users, and full control over hospital and doctor records.

The system is built using a **React.js** (Vite) front-end and a **Python Flask** REST API back-end, connected through **SQLAlchemy ORM** to a **SQLite/MySQL** database. Security is enforced through **JWT (JSON Web Token)** authentication and **bcrypt** password hashing. The interface incorporates a Razorpay-style simulated payment gateway for demonstration of real-world transactional flows.

---

## Introduction

The healthcare sector is one of the most vital industries globally. However, appointment management in many clinics and hospitals in India still relies on outdated methods — long phone queues, physical registration desks, and manual calendars. This leads to poor resource allocation, appointment clashes, and a frustrating experience for patients.

**BOOK MY DOCTOR** addresses this problem head-on by creating a modern, web-based system where:
- Patients can book appointments **24/7** from anywhere.
- Doctors have a real-time view of their **schedule and patient load**.
- Administrators can monitor the **entire system** from a single dashboard.

This project demonstrates the practical application of **full-stack web development**, **database design**, **REST API architecture**, and **role-based access control (RBAC)** — core competencies expected at the BCA level.

---

## Objectives

The primary objectives of the BOOK MY DOCTOR system are:

1. **Eliminate phone and walk-in bottlenecks** by offering an online appointment booking interface.
2. **Implement secure multi-role authentication** using JWT tokens, supporting patients, doctors, and admins.
3. **Create a real-time doctor discovery portal** that allows filtering by specialization, hospital, city, and rating.
4. **Build an end-to-end appointment management pipeline** — from booking through approval and payment to history review.
5. **Simulate a realistic payment gateway** (Razorpay-inspired) with card validation, OTP flow, and invoice generation.
6. **Provide administrative insights** through an analytics dashboard displaying earnings, user growth, and appointment trends.
7. **Design a responsive, premium UI** accessible on desktops, tablets, and mobile devices.

---

## Scope of the Project

| Feature Area | Scope |
|---|---|
| User Registration & Login | Patient, Doctor, Admin roles with JWT |
| Doctor Search & Filtering | By specialization, city, hospital |
| Hospital Directory | Browse hospitals, view associated doctors |
| Appointment Booking | Calendar-based slot selection with conflict checks |
| Appointment Management | Approve/Reject by Doctors; History view for Patients |
| Payment Simulation | Simulated card payment with OTP and invoice |
| Admin Dashboard | Analytics, User Management, Doctor/Hospital CRUD |
| Profile Management | Edit personal and professional details for all roles |
| Responsive Design | Mobile, tablet, widescreen viewport support |
| Database | SQLite (default) with MySQL production mode |

**Outside Scope (for future work):**
- Live SMS/Email notification integration
- Video telemedicine sessions
- Real payment gateway (Razorpay/Stripe live API)
- Mobile application (Android/iOS)

---

## System Requirements

### Hardware Requirements

| Component | Minimum Specification |
|---|---|
| Processor | Intel Core i3 (or equivalent) |
| RAM | 4 GB |
| Storage | 500 MB free disk space |
| Network | Stable internet connection (for package installation) |

### Software Requirements

| Software | Version | Purpose |
|---|---|---|
| Python | 3.8+ | Backend runtime |
| Node.js | 16.x LTS or 18.x LTS | Frontend runtime |
| Flask | 3.0.x | REST API framework |
| React.js | 18.x | Frontend UI framework |
| Vite | 4.x | React build tool |
| SQLite | (bundled) | Default database |
| MySQL | 8.x (optional) | Production database |
| Google Chrome / Firefox | Latest | Testing browser |

---

## Feasibility Study

### Technical Feasibility
All technologies used (Python, Flask, React, SQLite) are open-source, well-documented, and stable. The development team has sufficient knowledge of these technologies. The development environment is fully replicable on any standard laptop.

### Economic Feasibility
The entire stack is built using **free and open-source software**. No licensing costs are involved. Hosting (if deployed) can be done using free-tier cloud platforms (Render, Railway, Vercel).

### Operational Feasibility
The UI/UX is designed to be intuitive for non-technical users. The system requires minimal maintenance — auto database seeding on first boot means even fresh deployments are immediately usable.

---

## System Analysis

### Existing System – Drawbacks
- Patients must physically visit or call during working hours.
- No visibility into doctor availability before arriving.
- Appointment clashes are common.
- No digital payment records or invoices.
- Admin analytics are completely manual.

### Proposed System – Advantages
- 24/7 web-based access from any device.
- Real-time schedule visibility before booking.
- Slot conflict prevention at the database level.
- Digital payment simulation with printable invoices.
- Admin analytics dashboard with instant data aggregation.

---

## System Design

### Data Flow Diagrams (DFD)

#### Level 0 – Context Diagram (Conceptual)

```
+----------+         +-----------------+         +------------+
|  Patient | <-----> |  BOOK MY DOCTOR | <-----> |   Doctor   |
+----------+         |  Web Platform   |         +------------+
                     |                 |
+----------+         |  (Flask API +   |
|  Admin   | <-----> |   React SPA)    |
+----------+         +-----------------+
                              ^
                              |
                     +-----------------+
                     |   SQLite/MySQL  |
                     |    Database     |
                     +-----------------+
```

#### Level 1 – Data Flow Diagram

**Process 1: User Authentication**
```
Patient/Doctor/Admin --> [Register/Login Form] --> 1.0 AUTH PROCESS --> [JWT Token]
                                                       |
                                              [Users Table (DB)]
```

**Process 2: Doctor Search & Booking**
```
Patient --> [Search Panel (Specialization/City)] --> 2.0 SEARCH --> [Doctor Cards]
                                                          |
                                                 [Doctors + Hospitals Table]
Patient --> [Select Slot] --> 3.0 BOOK APPOINTMENT --> [Appointment Record]
                                                             |
                                                    [Appointments Table]
```

**Process 3: Payment Processing**
```
Patient --> [Payment Form] --> 4.0 PAYMENT SIMULATION --> [Transaction Record]
                                        |                        |
                                 [Payment Gateway]       [Payments Table]
                                   (Simulated)
```

**Process 4: Doctor Manages Appointments**
```
Doctor --> [Dashboard View] --> 5.0 APPOINTMENT REVIEW --> [Approve/Reject Action]
                                          |                         |
                                 [Appointments Table]     [Updated Status Record]
```

**Process 5: Admin Analytics**
```
Admin --> [Dashboard] --> 6.0 ANALYTICS QUERY --> [Aggregated Stats, Charts]
                                   |
                     [Users + Appointments + Payments]
```

---

### Entity-Relationship Diagram (ERD)

```
+----------+       1      N  +------------+        1       N  +-----------+
|   Users  |<--------------->|  Patients  |<----------------->|Appointments|
+----------+                 +------------+                   +-----------+
| PK id    |                 | PK id      |                   | PK id     |
| email    |                 | FK user_id |                   |FK patient |
| password |                 | first_name |                   |FK doctor  |
| role     |                 | last_name  |                   | date      |
+----------+                 | phone      |                   | time      |
     |                       | gender     |                   | status    |
     |                       | dob        |                   | reason    |
     |                       +------------+                   +-----------+
     |                                                              |
     | 1                                                          1 |
     |                                                              |
  N  |   +---------+   N          1  +----------+            +----------+
+--------+|Hospitals|<-------------->|  Doctors |            | Payments |
|Doctors ||         |                |          |            |          |
+--------+| PK id   |                | PK id    |            | PK id    |
|FK user || name    |                |FK user_id|            |FK appt_id|
|FK hosp || city    |                |FK hosp_id|            | amount   |
|  name  || address |                |FK spec_id|            | method   |
|  spec  || phone   |                | bio      |            | status   |
|  fee   || email   |                | fee      |            | txn_id   |
|  exp   || rating  |                | exp_yrs  |            +----------+
+--------++---------+                +----------+
     |                                    |
     |  N                              N  |
     |  +-----------+     +----------+   |
     +->| Schedules |     |Specialize|<--+
        |           |     |  ations  |
        | PK id     |     |          |
        |FK doctor  |     | PK id    |
        | day_week  |     | name     |
        | start_t   |     | desc     |
        | end_t     |     +----------+
        | available |
        +-----------+

+--------+    +-----------+    +-----------+
| Users  |--->|  Admins   |    | Feedbacks |
|(admin) |    |           |    |           |
+--------+    | PK id     |    | PK id     |
              |FK user_id |    |FK appt_id |
              | name      |    | rating    |
              | phone     |    | comment   |
              +-----------+    +-----------+
```

---

### Database Schema

#### Table: `users`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY, AUTO INCREMENT |
| email | VARCHAR(120) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| role | ENUM('patient','doctor','admin') | NOT NULL, DEFAULT 'patient' |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

#### Table: `patients`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| user_id | INTEGER | FOREIGN KEY → users.id |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| phone | VARCHAR(20) | — |
| gender | VARCHAR(10) | — |
| dob | DATE | — |
| address | TEXT | — |

#### Table: `doctors`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| user_id | INTEGER | FK → users.id |
| hospital_id | INTEGER | FK → hospitals.id |
| specialization_id | INTEGER | FK → specializations.id |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| experience_years | INTEGER | — |
| consultation_fee | DECIMAL(10,2) | — |
| bio | TEXT | — |

#### Table: `hospitals`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| city | VARCHAR(100) | — |
| address | TEXT | — |
| phone | VARCHAR(20) | — |
| email | VARCHAR(120) | — |
| rating | DECIMAL(2,1) | DEFAULT 0.0 |

#### Table: `appointments`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| patient_id | INTEGER | FK → patients.id |
| doctor_id | INTEGER | FK → doctors.id |
| appointment_date | DATE | NOT NULL |
| appointment_time | TIME | NOT NULL |
| status | ENUM | 'Pending','Approved','Rejected','Completed' |
| reason | TEXT | — |

#### Table: `payments`
| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| appointment_id | INTEGER | FK → appointments.id |
| amount | DECIMAL(10,2) | NOT NULL |
| transaction_id | VARCHAR(100) | UNIQUE |
| status | ENUM | 'Pending','Success','Failed' |
| payment_method | VARCHAR(50) | — |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React.js 18 (Vite) | Component-based SPA |
| **Frontend Routing** | React Router DOM v6 | Client-side navigation |
| **HTTP Client** | Axios | API communication with JWT interceptor |
| **Styling** | Vanilla CSS + Bootstrap 5 | Glassmorphic, responsive layouts |
| **Typography** | Google Fonts (Inter, Outfit) | Premium UI aesthetics |
| **Backend Framework** | Python Flask 3.x | REST API server |
| **ORM** | Flask-SQLAlchemy | Database abstraction layer |
| **Authentication** | PyJWT + bcrypt | Secure token auth & password hashing |
| **CORS** | Flask-CORS | Cross-origin request handling |
| **Database (Default)** | SQLite 3 | Zero-config local persistence |
| **Database (Production)** | MySQL 8.x + PyMySQL | Enterprise-grade persistence |

---

## Module Description

### Module 1: Authentication & Authorization
Handles all identity operations. Users register with email/password. On login, bcrypt verifies the hash and a 24-hour JWT token is issued. Every subsequent API request carries this token in the `Authorization: Bearer <token>` header. The middleware validates the token and enforces role-based restrictions.

### Module 2: Patient Portal
Patients can search for doctors by specialization and city, view available schedule slots, and book appointments. The booking engine checks for conflicts before inserting records. Patients can also view their full appointment history with status badges and payment invoice details.

### Module 3: Doctor Portal  
After login, doctors access a personalized dashboard showing pending, approved, and completed appointments. They can approve or reject individual appointment requests and update their weekly schedule availability.

### Module 4: Hospital Directory
A public-facing module allowing anyone to browse registered hospitals filtered by city. Each hospital card displays contact information, rating, and a link to view the associated doctors.

### Module 5: Payment Simulation Engine
A Razorpay-inspired payment flow implemented entirely in the frontend with a corresponding backend record-keeping API. The flow includes: card detail entry with real-time field validation, OTP entry screen, processing animation, and success/failure screens with invoice generation.

### Module 6: Admin Control Center
The Admin dashboard aggregates data from multiple tables and presents interactive analytics: total registered users, appointments by status, total simulated earnings, and doctor count. Admins can perform full CRUD operations on doctors, hospitals, and user accounts.

---

## Implementation

The implementation was carried out in five sequential phases:

**Phase 1 – Database Design**: Designed the normalized relational schema with 8 core tables. Created `schema.sql` for direct MySQL import and configured the SQLAlchemy ORM models for code-first table generation.

**Phase 2 – Backend Development**: Implemented the Flask application factory pattern. Developed 6 route blueprints covering all CRUD operations. Integrated JWT middleware with role validation. Implemented automatic database seeding on first boot.

**Phase 3 – Frontend Development**: Initialized the React + Vite project with Axios and React Router. Built 15 functional pages and 6 reusable component modules. Implemented AuthContext for global state management.

**Phase 4 – Integration**: Connected frontend API service (Axios) to Flask backend with interceptors. Verified JWT token flow end-to-end. Tested role-based UI rendering for all three roles.

**Phase 5 – Documentation**: Prepared the installation guide, API specification, testing guide, and this formal project report.

---

## Testing

Please refer to the dedicated [testing_guide.md](./testing_guide.md) document for comprehensive test cases and procedures.

### Summary of Test Results

| Test Case | Category | Expected Result | Status |
|---|---|---|---|
| Patient Registration | Functional | New user created, JWT returned | ✅ Pass |
| Patient Login | Functional | JWT token issued | ✅ Pass |
| Doctor Search by Specialization | Functional | Filtered doctor list returned | ✅ Pass |
| Book Appointment | Functional | Appointment record created | ✅ Pass |
| Payment Simulation | Functional | Transaction record created | ✅ Pass |
| Doctor Approves Appointment | Functional | Status updated to Approved | ✅ Pass |
| Admin Views Analytics | Functional | Aggregated stats returned | ✅ Pass |
| Invalid Token Access | Security | 401 Unauthorized returned | ✅ Pass |
| Role Violation Access | Security | 403 Forbidden returned | ✅ Pass |
| Mobile Responsive Layout | UI/UX | Layout adjusts without overflow | ✅ Pass |

---

## Conclusion & Future Enhancements

### Conclusion
**BOOK MY DOCTOR** successfully demonstrates a production-grade multi-role healthcare management system built on modern web technologies. The system achieves all defined objectives — secure authentication, real-time doctor discovery, end-to-end appointment booking, payment simulation, and administrative oversight — within a clean, well-structured codebase.

The project serves as a comprehensive demonstration of the following computer science concepts applied to a real-world domain:
- RESTful API design principles
- Relational database normalization
- Role-Based Access Control (RBAC)
- JWT-based stateless authentication
- React component architecture and state management
- Responsive UI design

### Future Enhancements

| Enhancement | Description |
|---|---|
| Real Payment Gateway | Integrate live Razorpay/Stripe API with webhook verification |
| Email/SMS Notifications | Send booking confirmations and reminders via Twilio/SendGrid |
| Video Consultation | Integrate WebRTC or Zoom SDK for telemedicine |
| AI Symptom Checker | Pre-booking symptom analysis to suggest relevant specializations |
| Mobile App | React Native wrapper for Android/iOS distribution |
| Advanced Reporting | Export appointment and payment reports as PDF |
| Doctor Ratings & Reviews | Public-facing star ratings and verified patient reviews |

---

## Bibliography & References

1. Flask Documentation – https://flask.palletsprojects.com/
2. React.js Official Documentation – https://react.dev/
3. SQLAlchemy ORM – https://docs.sqlalchemy.org/
4. PyJWT Library – https://pyjwt.readthedocs.io/
5. React Router v6 – https://reactrouter.com/
6. Bootstrap 5 – https://getbootstrap.com/
7. Axios HTTP Client – https://axios-http.com/
8. Vite Build Tool – https://vitejs.dev/
9. BCrypt Documentation – https://pypi.org/project/bcrypt/
10. MDN Web Docs – https://developer.mozilla.org/
11. Pressman, R.S. – *Software Engineering: A Practitioner's Approach*, 8th Edition
12. Connolly, T. & Begg, C. – *Database Systems: A Practical Approach to Design, Implementation and Management*

---

*End of Project Report*

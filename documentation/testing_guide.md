# BOOK MY DOCTOR – Complete Testing Guide

This document provides a comprehensive set of test cases, test data, manual verification steps, and expected outcomes for validating all features of the **BOOK MY DOCTOR** system.

---

## 📋 Prerequisite: Test Credentials (Seeded by Default)

Upon first server boot, the system auto-seeds the database with these accounts:

| Role | Email | Password | Notes |
|---|---|---|---|
| **Admin** | `admin@bookmydoctor.com` | `admin123` | Full admin dashboard access |
| **Doctor** | `dr.smith@bookmydoctor.com` | `password123` | Cardiologist – Apollo Hospital |
| **Doctor** | `dr.jane@bookmydoctor.com` | `password123` | Dermatologist – Max Hospital |
| **Patient** | `pat.jones@gmail.com` | `password123` | Existing patient with appointments |
| **Patient** | `pat.doe@gmail.com` | `password123` | Existing patient |

---

## 🔐 Section 1: Authentication & Authorization Tests

### TC-AUTH-01: Successful Patient Registration
- **URL**: POST `http://localhost:5000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "newpatient@test.com",
    "password": "TestPassword@123",
    "role": "patient",
    "first_name": "Test",
    "last_name": "User",
    "phone": "9876543210",
    "gender": "Male"
  }
  ```
- **Expected**: `201 Created`, response body includes `{ "message": "User registered successfully!" }` and a `token` field.
- **Verify**: Check browser `localStorage` for `bookMyDoctorToken`.

### TC-AUTH-02: Login with Valid Credentials
- **URL**: POST `http://localhost:5000/api/auth/login`
- **Body**:
  ```json
  { "email": "pat.jones@gmail.com", "password": "password123" }
  ```
- **Expected**: `200 OK`, response includes `token`, `user.id`, `user.role = "patient"`.

### TC-AUTH-03: Login with Invalid Password
- **Body**: `{ "email": "pat.jones@gmail.com", "password": "wrongpassword" }`
- **Expected**: `401 Unauthorized`, message: `"Invalid credentials"`.

### TC-AUTH-04: Access Protected Route Without Token
- **URL**: GET `http://localhost:5000/api/appointments/patient`
- **Headers**: *(No Authorization header)*
- **Expected**: `401 Unauthorized`, message: `"Authentication token is missing!"`.

### TC-AUTH-05: Admin Accessing Patient-Only Route
- **URL**: POST `http://localhost:5000/api/appointments/book`
- **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Expected**: `403 Forbidden`, message: `"Unauthorized access: Insufficient privileges!"`.

---

## 🏥 Section 2: Hospital & Doctor Search Tests

### TC-HOSP-01: Get All Hospitals
- **URL**: GET `http://localhost:5000/api/hospitals`
- **Expected**: `200 OK`, array of 4 hospitals (Apollo, Max, Fortis, Kokilaben).

### TC-HOSP-02: Search Hospitals by City
- **URL**: GET `http://localhost:5000/api/hospitals?city=Chennai`
- **Expected**: `200 OK`, array with only Apollo Speciality Hospital.

### TC-HOSP-03: Get All Doctors
- **URL**: GET `http://localhost:5000/api/doctors/all`
- **Expected**: `200 OK`, array with Dr. Robert Smith (Cardiology) and Dr. Jane Foster (Dermatology).

### TC-DOC-01: Search Doctors by Specialization
- **URL**: GET `http://localhost:5000/api/doctors?specialization=Cardiology`
- **Expected**: `200 OK`, array with Dr. Robert Smith only.

### TC-DOC-02: Get Single Doctor Schedules
- **URL**: GET `http://localhost:5000/api/doctors/<doctor_id>/schedules`
- **Expected**: `200 OK`, list of available schedule entries (Mon–Fri).

---

## 📅 Section 3: Appointment Booking Tests

### TC-APPT-01: Book an Appointment (Authenticated Patient)
- **URL**: POST `http://localhost:5000/api/appointments/book`
- **Headers**: `Authorization: Bearer <PATIENT_JWT_TOKEN>`
- **Body**:
  ```json
  {
    "doctor_id": 1,
    "appointment_date": "2026-08-15",
    "appointment_time": "10:30:00",
    "reason": "Routine cardiac checkup"
  }
  ```
- **Expected**: `201 Created`, response includes new appointment `id`, `status: "Pending"`.

### TC-APPT-02: Duplicate Booking Attempt
- Use the same body as TC-APPT-01.
- **Expected**: `400 Bad Request`, message indicating the slot is already taken.

### TC-APPT-03: Get Patient Appointment History
- **URL**: GET `http://localhost:5000/api/appointments/patient`
- **Headers**: `Authorization: Bearer <PATIENT_JWT_TOKEN>`
- **Expected**: `200 OK`, list of appointments for `pat.jones@gmail.com`.

### TC-APPT-04: Doctor Approves Appointment
- **URL**: PUT `http://localhost:5000/api/appointments/<appt_id>/status`
- **Headers**: `Authorization: Bearer <DOCTOR_JWT_TOKEN>`
- **Body**: `{ "status": "Approved" }`
- **Expected**: `200 OK`, `status` updated to `"Approved"`.

### TC-APPT-05: Doctor Rejects Appointment
- Same as TC-APPT-04 but: `{ "status": "Rejected" }`
- **Expected**: `200 OK`, `status` updated to `"Rejected"`.

---

## 💳 Section 4: Payment Simulation Tests

### TC-PAY-01: Process Simulated Payment
- **URL**: POST `http://localhost:5000/api/payments/charge`
- **Headers**: `Authorization: Bearer <PATIENT_JWT_TOKEN>`
- **Body**:
  ```json
  {
    "appointment_id": 1,
    "amount": 800.00,
    "payment_method": "Simulated Card",
    "transaction_id": "TXN_TEST_00001"
  }
  ```
- **Expected**: `201 Created`, response with `status: "Success"` and payment `id`.

### TC-PAY-02: Duplicate Transaction ID
- Re-submit TC-PAY-01 with the same `transaction_id`.
- **Expected**: `400 Bad Request`, conflict message.

---

## 👑 Section 5: Admin Dashboard Tests

### TC-ADMIN-01: View Analytics
- **URL**: GET `http://localhost:5000/api/admin/analytics`
- **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Expected**: `200 OK`, JSON object with:
  ```json
  {
    "total_users": 5,
    "total_appointments": 2,
    "total_earnings": 800.00,
    "total_doctors": 2,
    "total_hospitals": 4
  }
  ```

### TC-ADMIN-02: Get All Users
- **URL**: GET `http://localhost:5000/api/admin/users`
- **Headers**: `Authorization: Bearer <ADMIN_JWT_TOKEN>`
- **Expected**: `200 OK`, list of all 5 seeded users.

### TC-ADMIN-03: Patient Accessing Admin Route
- **URL**: GET `http://localhost:5000/api/admin/users`
- **Headers**: `Authorization: Bearer <PATIENT_JWT_TOKEN>`
- **Expected**: `403 Forbidden`.

---

## 🖥️ Section 6: Frontend UI Manual Verification

### TC-UI-01: Landing Page Load
- Open `http://localhost:3000` in browser.
- **Verify**:
  - [ ] Hero section with headline visible
  - [ ] Navbar with "Book My Doctor" logo
  - [ ] Doctor search shortcut visible
  - [ ] Stats counters animate on scroll
  - [ ] Footer links present

### TC-UI-02: Patient Registration via UI
- Navigate to `/register`.
- Fill in all fields with valid data.
- Click "Register".
- **Verify**:
  - [ ] User is redirected to Patient Dashboard (`/patient-dashboard`)
  - [ ] Navbar updates to show "Dashboard" and "Logout" links
  - [ ] Username displayed in Navbar

### TC-UI-03: Doctor Search via UI
- Navigate to `/doctors`.
- Select "Cardiology" in the specialization dropdown.
- **Verify**:
  - [ ] Only Dr. Robert Smith appears in results
  - [ ] Doctor card shows name, specialization, hospital, fee, rating
  - [ ] "Book Appointment" button navigates to `/book-appointment/<doctor_id>`

### TC-UI-04: Appointment Booking Flow
- Navigate to `/book-appointment/1` (as a logged-in patient).
- Select a future date and available time slot.
- Click "Book Appointment".
- **Verify**:
  - [ ] Success toast/message appears
  - [ ] User is redirected to the Payment page `/payment`

### TC-UI-05: Payment Simulation Flow
- On the Payment page:
  - Enter card number: `4111 1111 1111 1111`
  - Name: `Test User`
  - Expiry: `12/28`
  - CVV: `123`
  - Click "Pay Now"
- **Verify**:
  - [ ] OTP screen appears
  - [ ] Enter `123456` as OTP
  - [ ] Processing animation shown
  - [ ] Success screen displays with transaction ID
  - [ ] "Download Invoice" button appears

### TC-UI-06: Doctor Dashboard
- Login as `dr.smith@bookmydoctor.com` / `password123`.
- **Verify**:
  - [ ] Redirected to `/doctor-dashboard`
  - [ ] Appointment list shows seeded appointment
  - [ ] "Approve" and "Reject" buttons are functional

### TC-UI-07: Admin Dashboard
- Login as `admin@bookmydoctor.com` / `admin123`.
- **Verify**:
  - [ ] Redirected to `/admin-dashboard`
  - [ ] Analytics cards show correct seeded data
  - [ ] User management table is populated

### TC-UI-08: Role-Based Navigation
- **As Patient**: Verify Navbar shows "Dashboard", "History", not "Doctor Panel"
- **As Doctor**: Verify Navbar shows "Doctor Dashboard", not "Admin Panel"
- **As Admin**: Verify Navbar shows "Admin Dashboard"
- **As Guest**: Verify Navbar shows only "Login" and "Register"

### TC-UI-09: Unauthorized Route Redirect
- While NOT logged in, navigate to `/patient-dashboard`.
- **Verify**: Redirected to `/login`.
- Login, then manually navigate to `/admin-dashboard` as a patient.
- **Verify**: Redirected to `/` (or appropriate access denied page).

---

## 📱 Section 7: Responsive Design Verification

Test all critical pages at three breakpoints:

| Breakpoint | Width | Test |
|---|---|---|
| Mobile | 375px (iPhone SE) | No horizontal scrollbar, cards stack vertically |
| Tablet | 768px (iPad) | Sidebar collapses, 2-column grids |
| Desktop | 1440px | Full sidebar, 3+ column grids, max-width container |

**Pages to verify:**
- [ ] `/` (Home)
- [ ] `/doctors`
- [ ] `/book-appointment/1`
- [ ] `/patient-dashboard`
- [ ] `/doctor-dashboard`
- [ ] `/admin-dashboard`

---

## 🔒 Section 8: Security Verification

### TC-SEC-01: Password Storage
- Open `backend/book_my_doctor.db` in a SQLite viewer (e.g., DB Browser for SQLite).
- Check the `users` table.
- **Verify**: The `password_hash` column does NOT store plaintext passwords. It should show bcrypt hashes beginning with `$2b$`.

### TC-SEC-02: Token Expiry
- Copy a JWT token.
- Wait 24 hours (or modify `JWT_ACCESS_TOKEN_EXPIRES` in `config.py` to `5` seconds for testing).
- Make a request with the expired token.
- **Verify**: `401 Unauthorized`, message: `"Session expired. Please log in again."`.

### TC-SEC-03: JWT Tampering
- Modify the last 3 characters of a valid JWT token.
- Make an API request with the tampered token.
- **Verify**: `401 Unauthorized`, message: `"Invalid authentication token."`.

---

## 🚀 Section 9: API Quick Test (PowerShell)

Run these commands in PowerShell to quickly validate core API endpoints without a browser:

```powershell
# 1. Get all hospitals
Invoke-WebRequest -Uri "http://localhost:5000/api/hospitals" -Method GET | Select-Object -ExpandProperty Content

# 2. Get all doctors
Invoke-WebRequest -Uri "http://localhost:5000/api/doctors/all" -Method GET | Select-Object -ExpandProperty Content

# 3. Login and get a token
$body = '{"email":"pat.jones@gmail.com","password":"password123"}'
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"

# 4. Get patient appointments using the token
Invoke-WebRequest -Uri "http://localhost:5000/api/appointments/patient" -Method GET -Headers @{"Authorization"="Bearer $token"} | Select-Object -ExpandProperty Content

# 5. Admin analytics
$adminBody = '{"email":"admin@bookmydoctor.com","password":"admin123"}'
$adminResp = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $adminBody
$adminToken = ($adminResp.Content | ConvertFrom-Json).token
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/analytics" -Method GET -Headers @{"Authorization"="Bearer $adminToken"} | Select-Object -ExpandProperty Content
```

---

*Testing Guide – BOOK MY DOCTOR | BCA Final Year Project 2025–2026*

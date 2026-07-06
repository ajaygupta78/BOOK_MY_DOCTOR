# BOOK MY DOCTOR – REST API Documentation

This document describes all available API endpoints, expected request formats, authentication requirements, and sample responses.

**Base URL**: `http://localhost:5000/api`

**Authentication**: Most endpoints require a Bearer JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Routes (`/api/auth`)

### POST `/api/auth/register`
Register a new patient account.

**No Auth Required**

**Request Body**:
```json
{
  "email": "john.doe@email.com",
  "password": "securePass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "gender": "Male",
  "age": 28,
  "address": "Mumbai, Maharashtra"
}
```

**Success Response** `201`:
```json
{
  "message": "Account created successfully!",
  "token": "<JWT_TOKEN>",
  "user": { "id": 1, "email": "john.doe@email.com", "role": "patient" }
}
```

---

### POST `/api/auth/login`
Login with any account role (patient, doctor, admin).

**No Auth Required**

**Request Body**:
```json
{
  "email": "admin@bookmydoctor.com",
  "password": "admin123"
}
```

**Success Response** `200`:
```json
{
  "message": "Login successful!",
  "token": "<JWT_TOKEN>",
  "user": { "id": 1, "email": "admin@bookmydoctor.com", "role": "admin" }
}
```

---

### GET `/api/auth/profile`
Fetch current logged-in user profile details.

**Auth Required**: Any role

**Success Response** `200`:
```json
{
  "id": 1,
  "email": "john.doe@email.com",
  "role": "patient",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "9876543210",
  "gender": "Male",
  "age": 28,
  "address": "Mumbai, Maharashtra"
}
```

---

### PUT `/api/auth/profile`
Update profile biographical details for logged-in user.

**Auth Required**: Any role

**Request Body** (partial update supported):
```json
{
  "first_name": "Johnny",
  "phone": "8765432109",
  "address": "Delhi, NCR"
}
```

---

## 2. Hospital Routes (`/api/hospitals`)

### GET `/api/hospitals`
List all hospitals. Filter by city using query parameters.

**No Auth Required**

**Query Parameters**:
- `?city=Mumbai` – Filter by city name (case-insensitive)

**Success Response** `200`:
```json
[
  {
    "id": 1,
    "name": "Apollo Hospitals – Bandra",
    "city": "Mumbai",
    "address": "Linking Road, Bandra West",
    "phone": "022-29200000",
    "email": "mumbai@apollohospitals.com",
    "rating": 4.8
  }
]
```

---

### GET `/api/hospitals/cities`
Return all distinct city names where hospitals are registered.

**No Auth Required**

**Success Response** `200`:
```json
["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]
```

---

## 3. Doctor Routes (`/api/doctors`)

### GET `/api/doctors/all`
Fetch all registered doctors.

**No Auth Required**

---

### GET `/api/doctors/specializations`
List all medical specializations.

**No Auth Required**

**Success Response** `200`:
```json
[
  { "id": 1, "name": "Cardiologist", "description": "Heart and cardiovascular diseases" },
  { "id": 2, "name": "Neurologist", "description": "Brain and nervous system specialist" }
]
```

---

### GET `/api/doctors/search`
Search for doctors by specialization, hospital, or name.

**No Auth Required**

**Query Parameters**:
- `?specialization_id=1` – Filter by specialization ID
- `?hospital_id=2` – Filter by hospital ID
- `?name=sharma` – Filter by first or last name (partial match)

---

### GET `/api/doctors/<doctor_id>`
Fetch specific doctor profile details.

**No Auth Required**

---

### GET `/api/doctors/<doctor_id>/schedules`
Get available time slots for a doctor.

**No Auth Required**

**Success Response** `200`:
```json
[
  { "id": 1, "day_of_week": "Monday", "start_time": "09:00", "end_time": "17:00", "is_available": true }
]
```

---

### POST `/api/doctors/schedule`
Add or update availability schedule for logged-in doctor.

**Auth Required**: `doctor` role

**Request Body**:
```json
{
  "day_of_week": "Monday",
  "start_time": "09:00",
  "end_time": "17:00",
  "is_available": true
}
```

---

### DELETE `/api/doctors/schedule/<schedule_id>`
Remove a specific schedule slot.

**Auth Required**: `doctor` role

---

## 4. Appointment Routes (`/api/appointments`)

### POST `/api/appointments/book`
Book a new appointment.

**Auth Required**: `patient` role

**Request Body**:
```json
{
  "doctor_id": 2,
  "appointment_date": "2026-06-15",
  "time_slot": "10:00 AM"
}
```

**Success Response** `201`:
```json
{
  "message": "Appointment booked successfully!",
  "appointment": {
    "id": 5,
    "doctor_id": 2,
    "appointment_date": "2026-06-15",
    "time_slot": "10:00 AM",
    "status": "Pending",
    "payment_status": "Unpaid"
  }
}
```

---

### GET `/api/appointments/patient`
Get all appointments for logged-in patient.

**Auth Required**: `patient` role

---

### GET `/api/appointments/doctor`
Get all appointments assigned to logged-in doctor.

**Auth Required**: `doctor` role

---

### PUT `/api/appointments/<appointment_id>/status`
Update appointment status.

**Auth Required**: `doctor` role

**Request Body**:
```json
{
  "status": "Approved"
}
```
*Allowed values: `Pending`, `Approved`, `Rejected`, `Completed`*

---

### POST `/api/appointments/<appointment_id>/feedback`
Submit patient feedback/rating after appointment.

**Auth Required**: `patient` role

**Request Body**:
```json
{
  "rating": 5,
  "comment": "Excellent consultation, very professional and caring."
}
```

---

## 5. Payment Routes (`/api/payments`)

### POST `/api/payments/charge`
Record a payment transaction for an appointment.

**Auth Required**: `patient` role

**Request Body**:
```json
{
  "appointment_id": 5,
  "amount": 800.00,
  "payment_method": "Credit Card",
  "transaction_id": "TXN-BMD-1684930000-5"
}
```

**Success Response** `201`:
```json
{
  "message": "Payment processed successfully!",
  "payment": {
    "id": 3,
    "transaction_id": "TXN-BMD-1684930000-5",
    "amount": 800.00,
    "status": "Success"
  }
}
```

---

### GET `/api/payments/receipt/<appointment_id>`
Get payment receipt details for an appointment.

**Auth Required**: `patient` role

---

## 6. Admin Routes (`/api/admin`)

> All admin routes require Authorization with `admin` role JWT token.

### GET `/api/admin/analytics`
Get aggregated global system statistics.

**Success Response** `200`:
```json
{
  "patients_count": 15,
  "doctors_count": 8,
  "hospitals_count": 5,
  "appointments": { "total": 42, "pending": 10, "approved": 15, "completed": 12, "cancelled": 5 },
  "total_earnings": 33600.00,
  "average_rating": 4.7,
  "recent_appointments": [...]
}
```

---

### GET `/api/admin/patients`
Fetch all registered patient profiles.

### DELETE `/api/admin/patients/<patient_id>`
Permanently delete a patient account.

### GET `/api/admin/appointments`
Retrieve all clinical appointments in the global system.

### GET `/api/admin/payments`
Get complete financial payment ledger.

### POST `/api/admin/hospitals`
Create a new hospital registry entry.

### PUT `/api/admin/hospitals/<hospital_id>`
Update hospital details.

### DELETE `/api/admin/hospitals/<hospital_id>`
Delete a hospital (cascades to doctors and appointments).

### POST `/api/admin/doctors`
Create a new doctor with user account credentials.

**Request Body**:
```json
{
  "email": "dr.new@hospital.com",
  "password": "securePass123",
  "first_name": "Priya",
  "last_name": "Sharma",
  "specialization_id": 1,
  "hospital_id": 2,
  "phone": "9876543210",
  "gender": "Female",
  "experience_years": 10,
  "consultation_fee": 900,
  "bio": "MBBS, MD Cardiology from AIIMS Delhi, 10 years of clinical experience."
}
```

### PUT `/api/admin/doctors/<doctor_id>`
Update an existing doctor profile.

### DELETE `/api/admin/doctors/<doctor_id>`
Remove a doctor account (cascades to schedules and appointments).

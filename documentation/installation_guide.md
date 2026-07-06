# BOOK MY DOCTOR – Installation & Deployment Guide

This manual provides detailed instructions for setting up, configuring, and launching the **BOOK MY DOCTOR** appointment scheduling system. It supports both **Developer SQLite Local Mode** (zero database setup) and **Production MySQL Mode** (academic evaluation standard).

---

## 📋 Pre-requisites
Ensure the following software packages are installed on your host system:
1. **Python** (version 3.8 or higher)
2. **Node.js** (LTS version 16.x or 18.x) & **NPM**
3. **MySQL Server** (Optional – only required if deploying in MySQL Mode)

---

## 🛠️ Step 1: Backend Setup (Flask REST API)

### 1. Extract & Navigate
Open your terminal (PowerShell, Command Prompt, or Bash) and navigate to the backend folder:
```bash
cd backend
```

### 2. Configure Virtual Environment (Recommended)
Creating an isolated environment prevents package conflicts:
```bash
# Create Virtualenv
python -m venv venv

# Activate Virtualenv (Windows PowerShell)
.\venv\Scripts\activate

# Activate Virtualenv (Windows Command Prompt)
.\venv\Scripts\activate.bat

# Activate Virtualenv (macOS/Linux)
source venv/bin/activate
```

### 3. Install Package Dependencies
Install the required libraries listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 4. Select Database Mode
By default, the backend checks for a live MySQL server. If MySQL is unreachable, it **automatically falls back to standard local SQLite** (`book_my_doctor.db`), auto-seeds the schema, and enters all initial values.

To configure **MySQL Mode** manually:
1. Open your MySQL client (CLI, Workbench, or phpMyAdmin).
2. Create a database named `book_my_doctor`:
   ```sql
   CREATE DATABASE book_my_doctor;
   ```
3. Open `backend/config.py` in your code editor.
4. Modify the `SQLALCHEMY_DATABASE_URI` string to match your local MySQL credentials:
   ```python
   # Example MySQL Connection URL: mysql+pymysql://<user>:<password>@localhost/<db_name>
   SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:mySecurePassword123@localhost/book_my_doctor"
   ```
5. If running MySQL, you can import [database/schema.sql](../database/schema.sql) directly, or simply let the Flask server build and seed tables automatically on its first boot.

### 5. Launch Flask API
Start the REST API server:
```bash
python app.py
```
You should see:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
```
*Note: The automatic seeder will log DB creations and credentials on screen.*

---

## 💻 Step 2: Frontend Setup (React SPA + Vite)

### 1. Navigate to Frontend
Open a new terminal session and navigate to the frontend directory:
```bash
cd frontend
```

### 2. Install Node Packages
Run `npm install` to download Vite, React, Bootstrap, and Axios dependencies:
```bash
npm install
```

### 3. Review API Base URL
The React app connects to the Flask API using `Axios` in `frontend/src/services/api.js`. It defaults to:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```
Make sure the ports match if you alter the backend configuration.

### 4. Launch Vite Development Server
Run the local dev command:
```bash
npm run dev
```
You should see:
```text
  VITE v4.4.5  ready in 435 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your web browser.

---

## ⚡ Verification Checklist
Verify the installation by checking:
1. **Home Screen**: Landing panel loads with Outfit typography, slider items, and FAQ grids.
2. **Auto DB Seeds**: Click `Login`, enter `admin@bookmydoctor.com` / `admin123`. The admin dashboard analytical stats should load immediately (reading from seeded DB records).
3. **API Headers Interceptor**: When logged in as a patient, check the network tab. The `Authorization: Bearer <JWT_TOKEN>` header should be attached to `/api/appointments/patient` queries automatically.

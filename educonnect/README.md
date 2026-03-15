# EduConnect — Admin & Parent Portal (MERN Stack)

---

## 🚀 How to Run in VS Code

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB → https://www.mongodb.com/try/download/community

### Step 1 — Start MongoDB
```
mongod                                  # Windows / Linux
brew services start mongodb-community   # Mac
```

### Step 2 — Backend (Terminal 1)
```
cd backend
npm install
npm run dev
```

### Step 3 — Frontend (Terminal 2)
```
cd frontend
npm install
npm start
```

Opens at http://localhost:3000

---

## 🔑 Login Credentials

### Admin
Email: admin@college.edu
Password: admin123

### Parent (Demo)
Student 1: Reg CS2021001 | Phone 9876543210
Student 2: Reg EC2022015 | Phone 8765432109

---

## 📲 Enable REAL OTP to Your Mobile Number

By default the app runs in DEMO MODE — OTP is shown on screen.
To receive a real SMS on any Indian mobile number:

### Step 1 — Create Free Fast2SMS Account
1. Go to https://www.fast2sms.com
2. Click Sign Up
3. Enter your mobile number and verify it
4. You get FREE credits on signup

### Step 2 — Get Your API Key
1. Log in to Fast2SMS
2. Go to Dashboard → Dev API
3. Copy your API Key

### Step 3 — Update backend/.env
Open backend/.env and change these two lines:

  FAST2SMS_API_KEY=paste_your_api_key_here
  SMS_ENABLED=true

Restart backend → npm run dev
OTPs will now be sent as real SMS!

### Step 4 — Use Your Own Phone Number
1. Log in as Admin → All Students
2. Edit any student → Parent & Contact tab
3. Change Parent Phone to YOUR real mobile number
4. Save → now login as Parent with that number and receive real OTP!

---

## SMS Mode Reference

SMS_ENABLED=false  →  Demo mode (OTP shown on screen)
SMS_ENABLED=true + valid key  →  Real SMS sent to phone
SMS fails for any reason  →  Auto falls back to demo mode (app never crashes)

---

## Project Structure

educonnect/
  backend/
    server.js
    .env                   ← Add API key here
    utils/sms.js           ← Fast2SMS integration (NEW)
    models/  Admin, Student, OTP
    routes/  adminAuth, adminStudents, parentAuth, chat, student
    data/seed.js
  frontend/src/
    App.js
    pages/auth/   Landing, AdminLogin, ParentLogin
    pages/admin/  Dashboard, StudentList, StudentForm, StudentView
    pages/parent/ ParentChat
    components/admin/AdminLayout

---

## Troubleshooting

OTP not received?
  - Check SMS_ENABLED=true in .env
  - Verify API key is correct
  - Phone must be 10 digits (no +91 prefix)
  - Check backend terminal for SMS logs
  - Fast2SMS free tier has daily limits

MongoDB not connecting?
  - Make sure mongod is running

Port conflict?
  - Change PORT=5001 in .env
  - Change proxy to http://localhost:5001 in frontend/package.json

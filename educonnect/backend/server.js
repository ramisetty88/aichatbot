require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.set("trust proxy", 1);
// Routes
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin/students', require('./routes/adminStudents'));
app.use('/api/parent/auth', require('./routes/parentAuth'));
app.use('/api/parent/chat', require('./routes/chat'));
app.use('/api/parent/student', require('./routes/student'));
app.get('/api/health', (_, res) => res.json({ status: 'OK' }));
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    const seed = require('./data/seed');
    await seed();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`\n🔐 Admin login:  admin@college.edu / admin123`);
      console.log(`👨‍👩‍👦 Parent 1:    CS2021001 / 9876543210`);
      console.log(`👨‍👩‍👦 Parent 2:    EC2022015 / 8765432109\n`);
    });
  })
  .catch(err => console.error('❌ MongoDB error:', err));
console.log("FAST2SMS KEY:", process.env.FAST2SMS_API_KEY);
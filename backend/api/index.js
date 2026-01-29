// api/index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../config/db');

const app = express();

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* -------------------- Database (Serverless-safe) -------------------- */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

/* -------------------- Static uploads (LOCAL ONLY) -------------------- */
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
}

/* -------------------- Routes -------------------- */
app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/products'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/users', require('../routes/users'));

/* -------------------- Health Check -------------------- */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Shop Hub API is running',
    serverless: !!process.env.VERCEL,
  });
});

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/* -------------------- 404 Handler -------------------- */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* -------------------- Export (NO app.listen) -------------------- */
module.exports = app;

require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize Express App
const app = express();

// Connect Database (MongoDB Atlas / Local)
connectDB().catch((err) => {
  console.error('[Initial DB Connect Warning]:', err.message);
});

// Middleware to ensure DB connection is ready before processing API requests
app.use(async (req, res, next) => {
  const isApi = req.path.startsWith('/api') || 
                req.path.startsWith('/auth') || 
                req.path.startsWith('/courses') || 
                req.path.startsWith('/progress') || 
                req.path.startsWith('/dashboard') ||
                req.path.startsWith('/health');
  if (isApi) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[DB Request Middleware Error]:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed. Please ensure MongoDB Atlas is accessible.',
        error: err.message
      });
    }
  }
  next();
});

// CORS Configuration - Supports Local Dev & Production Deployment (Vercel/Render)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any origin if CLIENT_URL is '*' or during development
    if (process.env.CLIENT_URL === '*' || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for easy initial deployment
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API (For Vercel, Render & Uptime Monitors)
const handleHealthCheck = (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    status: 'online',
    project: 'LearnPulse - Interactive Learning & Course Management Hub',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
};
app.get('/api/health', handleHealthCheck);
app.get('/health', handleHealthCheck);

// API Routes (mounted on both /api/* and /* for maximum serverless router compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/courses', courseRoutes);
app.use('/courses', courseRoutes);

app.use('/api/progress', progressRoutes);
app.use('/progress', progressRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);

// Serve Frontend SPA in Production / Single-Service Deployment
const path = require('path');
const fs = require('fs');

const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('<h3>LearnPulse API is running smoothly. Access endpoints via /api/...</h3>');
  });
}

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;

// Start HTTP server if run directly (Local dev, Render, Docker, or Vercel Services)
// When imported as a module (e.g. Vercel Serverless api/index.js), app is exported without calling listen
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 LearnPulse Backend Server Running on Port: ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📡 Database: Configured for MongoDB Atlas & Local`);
    console.log(`====================================================`);
  });
}

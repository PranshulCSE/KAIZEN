const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Trust reverse proxy (essential for Render, Railway, Vercel, Heroku)
// Ensures express-rate-limit tracks actual client IPs instead of the shared proxy IP
app.set('trust proxy', 1);

const logger = require('./utils/logger.js');

// Routes
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const resumeRoutes = require('./routes/resumeRoutes.js');
const jobRoutes = require('./routes/jobRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');

// Security & Parsing Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint (placed BEFORE rate-limiting and request-logging
// so uptime monitors, keep-alive self-pings, and frontend warm-ups never get throttled)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Kaizen API Server is running',
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Request logging (skips noisy health checks to keep logs clean)
app.use((req, res, next) => {
    if (req.path !== '/health') {
        logger.info(`${req.method} ${req.originalUrl}`);
    }
    next();
});

// Rate limiting (300 requests per 15 min default to prevent locking out active users)
const limiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please wait a few moments and try again.'
    }
});

app.use(limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack });
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;

const express = require ('express');
const app = express();
const cors = require ('cors');
const helmet = require ('helmet');
const rateLimit = require ('express-rate-limit');
require ('dotenv').config({ path: '../.env' });


// Routes
const authRoutes = require ('./routes/authRoutes.js');
const adminRoutes = require ('./routes/adminRoutes.js');
const resumeRoutes = require ('./routes/resumeRoutes.js');
const jobRoutes = require ('./routes/jobRoutes.js');
const aiRoutes = require ('./routes/aiRoutes.js');


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX)
});

app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// Routes
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
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;

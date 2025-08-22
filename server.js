require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import utilities
const connectDB = require('./utils/database');
const logger = require('./utils/logger');

// Import routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user.routes');
const studentRoutes = require('./routes/student.routes');
const adminRoutes = require('./routes/admin.routes');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(logger.httpLogger);

// API Routes
const API_VERSION = process.env.API_VERSION || '/api/v1';

app.use(API_VERSION, indexRoutes);
app.use(`${API_VERSION}/users`, userRoutes);
// Student form submission (POST only)
app.use('/api/student-form', studentRoutes);
// Admin dashboard (GET only)
app.use('/api/admin-dashboard', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mawthooq Educational Consultancy API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Welcome message for root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Mawthooq Educational Consultancy API',
    description: 'Your trusted academic partner to reach the best universities worldwide',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: API_VERSION,
      users: `${API_VERSION}/users`,
      'student-form': '/api/student-form',
      'admin-dashboard': '/api/admin-dashboard'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.error(`Error: ${error.message}`);
  
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : error.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Mawthooq Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;

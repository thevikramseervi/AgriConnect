const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRouter = require('./routes/authRoutes');
const farmerRouter = require('./routes/farmerRoutes');
const vendorRouter = require('./routes/vendorRouters');
const customerRouter = require('./routes/customerRoutes');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/orders');
const paymentRouter = require('./routes/payments');

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Configuration
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/farmer', farmerRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/customer', customerRouter);
app.use('/api/products', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to AgriConnect API',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      error: err 
    })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
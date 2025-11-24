const mongoose = require('mongoose');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

/**
 * Validation middleware for request bodies
 */

const validateRegister = (req, res, next) => {
  const { name, email, password, role, locality, address, phone } = req.body;
  
  // Check required fields
  if (!name || !email || !password || !role || !locality || !address || !phone) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Name, email, password, role, locality, address, and phone are required'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Password must be at least 6 characters long'
    });
  }

  // Password complexity check
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid email format'
    });
  }

  // Role validation
  const validRoles = ['farmer', 'vendor', 'customer'];
  if (!validRoles.includes(role)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid role. Must be farmer, vendor, or customer'
    });
  }

  // Phone validation (basic)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Invalid phone number format. Must be 10-15 digits'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Email and password are required'
    });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, pricePerUnit, quantity, category, locality, address } = req.body;
  
  // Check all required fields
  if (!name || !pricePerUnit || !quantity || !category || !locality || !address) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Name, pricePerUnit, quantity, category, locality, and address are required'
    });
  }

  // Validate numeric values
  if (pricePerUnit <= 0 || quantity <= 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Price and quantity must be greater than 0'
    });
  }

  // Validate types
  if (typeof pricePerUnit !== 'number' || typeof quantity !== 'number') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Price and quantity must be numbers'
    });
  }

  next();
};

const validatePurchase = (req, res, next) => {
  const { quantity } = req.body;
  
  if (!quantity || quantity <= 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Quantity must be greater than 0'
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { address, items } = req.body;
  
  if (!address || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Address and items array are required'
    });
  }

  for (const item of items) {
    if (!item.vendorProductId || !item.quantity || item.quantity <= 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Each item must have vendorProductId and valid quantity'
      });
    }
  }

  next();
};

const validateObjectId = (req, res, next) => {
  const idParam = req.params.productId || req.params.orderId;
  
  if (idParam && !mongoose.Types.ObjectId.isValid(idParam)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: MESSAGES.COMMON.INVALID_ID
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validatePurchase,
  validateOrder,
  validateObjectId
};


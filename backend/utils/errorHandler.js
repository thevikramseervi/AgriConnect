/**
 * Centralized error handling utility
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to avoid try-catch in every controller
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });
  };
};

/**
 * Common error response helper
 */
const sendError = (res, statusCode, message, error = null) => {
  const response = { message };
  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }
  return res.status(statusCode).json(response);
};

/**
 * Common success response helper
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = { message };
  if (data) {
    Object.assign(response, data);
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  asyncHandler,
  sendError,
  sendSuccess
};




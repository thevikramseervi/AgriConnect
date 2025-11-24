/**
 * Application-wide constants
 */

const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  PARTIAL: 'partial',
  SOLD: 'sold'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESSFUL: 'Successful',
  FAILED: 'failed'
};

const USER_ROLES = {
  FARMER: 'farmer',
  VENDOR: 'vendor',
  CUSTOMER: 'customer'
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registered Successfully',
    REGISTER_FAILED: 'Registration failed',
    LOGIN_SUCCESS: 'Login Successful',
    LOGIN_FAILED: 'Login Failed',
    USER_EXISTS: 'User already exists',
    USER_NOT_FOUND: "User doesn't exist",
    INVALID_CREDENTIALS: 'Invalid Credentials'
  },
  PRODUCT: {
    CREATED: 'Product listing successful',
    UPDATED: 'Product has been updated successfully',
    DELETED: 'Product deleted successfully',
    FETCHED: 'Products fetched successfully',
    NOT_FOUND: 'Product not found',
    INSUFFICIENT_STOCK: 'Insufficient stock or product not found',
    CREATE_FAILED: 'Product listing failed',
    UPDATE_FAILED: 'Failed to update products',
    DELETE_FAILED: 'Product deletion failed',
    FETCH_FAILED: 'Failed to fetch products'
  },
  ORDER: {
    CREATED: 'Order placed successfully',
    FETCHED: 'Orders fetched successfully',
    NOT_FOUND: 'No orders found for this user',
    FAILED: 'Order failed',
    DETAILS_FAILED: 'Failed to fetch order details'
  },
  PURCHASE: {
    SUCCESS: 'Purchase Successful',
    FAILED: 'Purchase Failed',
    ALREADY_PURCHASED: 'You have already purchased this product',
    DUPLICATE_VENDOR: 'You have already purchased this farmer product'
  },
  ANALYTICS: {
    SUCCESS: 'Analytics fetched successfully',
    FAILED: 'Analytics failed'
  },
  COMMON: {
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    INVALID_ID: 'Invalid ID format',
    INTERNAL_ERROR: 'Internal server error'
  }
};

module.exports = {
  PRODUCT_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  HTTP_STATUS,
  MESSAGES
};




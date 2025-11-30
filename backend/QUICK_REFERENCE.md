# Quick Reference Guide - AgriConnect Backend

## Table of Contents
1. [Error Handling](#error-handling)
2. [Constants](#constants)
3. [Validation](#validation)
4. [Services](#services)
5. [Controller Patterns](#controller-patterns)

---

## Error Handling

### Import
```javascript
const { asyncHandler, sendSuccess, sendError, AppError } = require('../utils/errorHandler');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
```

### Usage in Controllers

#### Basic Success Response
```javascript
const myController = asyncHandler(async (req, res) => {
  const data = await SomeModel.find();
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SOME.SUCCESS, { data });
});
```

#### Throwing Errors
```javascript
const myController = asyncHandler(async (req, res) => {
  const item = await Model.findById(id);
  
  if (!item) {
    throw new AppError(MESSAGES.ITEM.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ITEM.FETCHED, { item });
});
```

---

## Constants

### HTTP Status Codes
```javascript
HTTP_STATUS.OK              // 200
HTTP_STATUS.CREATED         // 201
HTTP_STATUS.BAD_REQUEST     // 400
HTTP_STATUS.UNAUTHORIZED    // 401
HTTP_STATUS.FORBIDDEN       // 403
HTTP_STATUS.NOT_FOUND       // 404
HTTP_STATUS.CONFLICT        // 409
HTTP_STATUS.INTERNAL_ERROR  // 500
```

### Product Status
```javascript
PRODUCT_STATUS.AVAILABLE    // 'available'
PRODUCT_STATUS.PARTIAL      // 'partial'
PRODUCT_STATUS.SOLD         // 'sold'
```

### User Roles
```javascript
USER_ROLES.FARMER           // 'farmer'
USER_ROLES.VENDOR           // 'vendor'
USER_ROLES.CUSTOMER         // 'customer'
```

### Messages
```javascript
MESSAGES.AUTH.REGISTER_SUCCESS
MESSAGES.AUTH.LOGIN_SUCCESS
MESSAGES.AUTH.USER_EXISTS
MESSAGES.AUTH.USER_NOT_FOUND
MESSAGES.AUTH.INVALID_CREDENTIALS

MESSAGES.PRODUCT.CREATED
MESSAGES.PRODUCT.UPDATED
MESSAGES.PRODUCT.DELETED
MESSAGES.PRODUCT.FETCHED
MESSAGES.PRODUCT.NOT_FOUND

MESSAGES.ORDER.CREATED
MESSAGES.ORDER.FETCHED
MESSAGES.ORDER.NOT_FOUND

MESSAGES.PURCHASE.SUCCESS
MESSAGES.PURCHASE.FAILED
MESSAGES.PURCHASE.ALREADY_PURCHASED

MESSAGES.ANALYTICS.SUCCESS
MESSAGES.ANALYTICS.FAILED

MESSAGES.COMMON.UNAUTHORIZED
MESSAGES.COMMON.FORBIDDEN
MESSAGES.COMMON.INVALID_ID
```

---

## Validation

### Import
```javascript
const {
  validateRegister,
  validateLogin,
  validateProduct,
  validatePurchase,
  validateOrder,
  validateObjectId
} = require('../middleware/validation');
```

### Route Usage
```javascript
// Auth validation
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Product validation
router.post('/product', authMiddleware, roleMiddleware, validateProduct, createProduct);

// ObjectId validation
router.get('/product/:productId', validateObjectId, getProduct);

// Purchase validation
router.post('/purchase/:productId', validateObjectId, validatePurchase, purchase);

// Order validation
router.post('/order', validateOrder, createOrder);
```

---

## File Uploads

### Import
```javascript
const upload = require('../middleware/uploadMiddleware');
```

### Route Usage
```javascript
// Single file upload (field name: 'image')
router.post('/product', upload.single('image'), createProduct);
```

### Accessing File in Controller
```javascript
const createProduct = asyncHandler(async (req, res) => {
  const file = req.file; // Contains file info
  // file.path -> path to saved file
  // file.filename -> saved filename
  
  const imageUrl = file ? `/uploads/products/${file.filename}` : null;
  
  // ... create product with imageUrl
});
```

---

## Services

### Analytics Service

#### Import
```javascript
const analyticsService = require('../services/analyticsService');
```

#### Usage
```javascript
// Farmer sales analytics
const sales = await analyticsService.getFarmerSalesAnalytics(farmerId);

// Vendor sales analytics
const sales = await analyticsService.getVendorSalesAnalytics(vendorId);

// Vendor expenditure analytics
const expenditure = await analyticsService.getVendorExpenditureAnalytics(vendorId);

// Customer expenditure analytics
const expenditure = await analyticsService.getCustomerExpenditureAnalytics(customerId);
```

### Purchase Service

#### Import
```javascript
const PurchaseService = require('../services/purchaseService');
```

#### Usage
```javascript
// Vendor purchasing from farmer
const result = await PurchaseService.purchaseFromFarmer(vendorId, productId, quantity);
// Returns: { vendorProduct, order, orderItems, payment }

// Customer purchasing from vendor
const result = await PurchaseService.purchaseFromVendor(customerId, locality, address, items);
// Returns: { order, orderItems, payment }
```

---

## Controller Patterns

### Basic CRUD Operations

#### Create
```javascript
const create = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = req.user._id;
  
  const item = new Model({ ...data, userId });
  await item.save();
  
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.ITEM.CREATED, { item });
});
```

#### Read (Single)
```javascript
const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Model.findById(id);
  
  if (!item) {
    throw new AppError(MESSAGES.ITEM.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ITEM.FETCHED, { item });
});
```

#### Read (Multiple)
```javascript
const getAll = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const items = await Model.find({ userId });
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ITEM.FETCHED, { items });
});
```

#### Update
```javascript
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const updated = await Model.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true }
  );
  
  if (!updated) {
    throw new AppError(MESSAGES.ITEM.UPDATE_FAILED, HTTP_STATUS.NOT_FOUND);
  }
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ITEM.UPDATED, { item: updated });
});
```

#### Delete
```javascript
const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  
  const deleted = await Model.findOneAndDelete({ _id: id, userId });
  
  if (!deleted) {
    throw new AppError(MESSAGES.ITEM.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ITEM.DELETED, { item: deleted });
});
```

### Using Services
```javascript
const someController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Call service
  const result = await SomeService.doSomething(userId);
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SOME.SUCCESS, result);
});
```

---

## Model Imports

### Standard Import
```javascript
// Import all models
const { User, FarmerProduct, VendorProduct, Order, OrderItem, Payment } = require('../models');

// Or import specific models
const { User } = require('../models');
```

### Individual Import (Alternative)
```javascript
const User = require('../models/user');
```

---

## Route Patterns

### Basic Route
```javascript
router.get('/endpoint', authMiddleware, controller);
```

### With Role Verification
```javascript
router.get('/endpoint', authMiddleware, roleMiddleware(['farmer']), controller);
```

### With Validation
```javascript
router.post('/endpoint', authMiddleware, validateSomething, controller);
```

### Complete Example
```javascript
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateProduct, validateObjectId } = require('../middleware/validation');
const { createProduct, getProduct } = require('../controllers/productController');

const roleVerification = roleMiddleware(['farmer']);

router.post('/product', authMiddleware, roleVerification, validateProduct, createProduct);
router.get('/product/:productId', authMiddleware, validateObjectId, getProduct);

module.exports = router;
```

---

## Best Practices

1. **Always use `asyncHandler`** for async controller functions
2. **Use constants** for status codes and messages
3. **Use services** for reusable business logic
4. **Validate input** with middleware before processing
5. **Use `sendSuccess`** for consistent response format
6. **Throw `AppError`** for operational errors
7. **Import models** from `../models` for consistency
8. **Keep controllers thin** - move logic to services
9. **Use descriptive variable names**
10. **Add comments** for complex logic

---

## Common Patterns

### Conditional Response Based on Role
```javascript
const getByRole = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const userId = req.user._id;
  
  let data;
  
  switch (role) {
    case USER_ROLES.FARMER:
      data = await Service.getFarmerData(userId);
      break;
    case USER_ROLES.VENDOR:
      data = await Service.getVendorData(userId);
      break;
    case USER_ROLES.CUSTOMER:
      data = await Service.getCustomerData(userId);
      break;
    default:
      throw new AppError(MESSAGES.COMMON.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SOME.SUCCESS, data);
});
```

### Checking Existence Before Action
```javascript
const doAction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await Model.findById(id);
  
  if (!item) {
    throw new AppError(MESSAGES.ITEM.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  
  // Check for duplicates
  const existing = await Model.findOne({ someField: item.someField });
  if (existing) {
    throw new AppError(MESSAGES.ITEM.ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
  }
  
  // Perform action
  await item.doSomething();
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ACTION.SUCCESS, { item });
});
```

---

## Debugging Tips

1. **Check validation first** - Most errors are input validation issues
2. **Use console.log sparingly** - Consider using a logger (Winston/Morgan)
3. **Check HTTP status codes** - Make sure they match the error type
4. **Verify middleware order** - Auth → Role → Validation → Controller
5. **Test with Postman/Thunder Client** - Verify endpoints work as expected




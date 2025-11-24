const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validation');
const {
  getPaymentStatus,
  getPaymentsByUser
} = require('../controllers/paymentController');

const allRoles = ['vendor', 'farmer', 'customer'];

router.get('/paymentStatus/:orderId', authMiddleware, roleMiddleware(allRoles), validateObjectId, getPaymentStatus);

router.get('/payment', authMiddleware, roleMiddleware(allRoles), getPaymentsByUser);

module.exports = router;
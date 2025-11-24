const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateObjectId } = require('../middleware/validation');
const {
  getOrdersByUser,
  getOrderDetails,
  getDashboardByRole
} = require('../controllers/orderController');

const allRoles = ['customer', 'vendor', 'farmer'];

router.get('/orders', authMiddleware, roleMiddleware(allRoles), getOrdersByUser);

router.get('/order/:orderId', authMiddleware, roleMiddleware(allRoles), validateObjectId, getOrderDetails);

router.get('/dashboard', authMiddleware, roleMiddleware(allRoles), getDashboardByRole);

module.exports = router;

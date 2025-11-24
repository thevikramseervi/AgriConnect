const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateOrder } = require('../middleware/validation');
const {
  purchaseFromVendor,
  getCustomerExpenditureAnalytics
} = require('../controllers/customerController');

const roleVerification = roleMiddleware(['customer']);

router.post('/purchase', authMiddleware, roleVerification, validateOrder, purchaseFromVendor);

router.get('/expenditureAnalytics', authMiddleware, roleVerification, getCustomerExpenditureAnalytics);

module.exports = router;
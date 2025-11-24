const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validatePurchase, validateObjectId } = require('../middleware/validation');
const {
  purchaseFromFarmer,
  getVendorProduct,
  getVendorExpenditureAnalytics,
  getVendorSalesAnalytics
} = require('../controllers/vendorController');

const roleVerification = roleMiddleware(['vendor']);

router.get('/products', authMiddleware, roleVerification, getVendorProduct);

router.post('/purchase/:productId',
  authMiddleware,
  roleVerification,
  validateObjectId,
  validatePurchase,
  purchaseFromFarmer
);

router.get('/salesAnalytics', authMiddleware, roleVerification, getVendorSalesAnalytics);

router.get('/expenditureAnalytics', authMiddleware, roleVerification, getVendorExpenditureAnalytics);

module.exports = router;
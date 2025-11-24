const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateProduct, validateObjectId } = require('../middleware/validation');
const upload = require('../middleware/uploadMiddleware');
const {
  createFarmerProduct,
  getMyFarmerProducts,
  updateFarmerProduct,
  deleteFarmerProduct,
  getFarmerSalesAnalytics
} = require('../controllers/farmerController');

const roleVerification = roleMiddleware(['farmer']);

router.post('/product', authMiddleware, roleVerification, upload.single('image'), validateProduct, createFarmerProduct);

router.get('/products', authMiddleware, roleVerification, getMyFarmerProducts);

router.put('/updateProduct/:productId', authMiddleware, roleVerification, validateObjectId, upload.single('image'), updateFarmerProduct);

router.delete('/deleteProduct/:productId', authMiddleware, roleVerification, validateObjectId, deleteFarmerProduct);

router.get('/salesAnalytics', authMiddleware, roleVerification, getFarmerSalesAnalytics);

module.exports = router;
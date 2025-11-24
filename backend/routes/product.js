const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAvailableProducts } = require('../controllers/productController');

const allRoles = ['farmer', 'customer', 'vendor'];

router.get('/available', authMiddleware, roleMiddleware(allRoles), getAvailableProducts);

module.exports = router;
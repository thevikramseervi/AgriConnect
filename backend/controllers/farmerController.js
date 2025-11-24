const { FarmerProduct } = require('../models');
const { asyncHandler, sendSuccess, AppError } = require('../utils/errorHandler');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const analyticsService = require('../services/analyticsService');
const path = require('path');
const fs = require('fs');

const createFarmerProduct = asyncHandler(async (req, res) => {
  const { name, pricePerUnit, quantity, category, locality, address } = req.body;
  const farmerId = req.user._id;

  // Handle image upload
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/products/${req.file.filename}`;
  }

  const farmerProduct = new FarmerProduct({
    name,
    pricePerUnit,
    quantity,
    category,
    locality,
    address,
    farmerId,
    imageUrl
  });
  
  await farmerProduct.save();
  
  console.log('[FARMER] Product created:', { 
    name: farmerProduct.name, 
    status: farmerProduct.status, 
    quantity: farmerProduct.quantity,
    locality: farmerProduct.locality
  });
  
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.PRODUCT.CREATED, {
    product: farmerProduct
  });
});

const getMyFarmerProducts = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  const product = await FarmerProduct.find({ farmerId });
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.FETCHED, { product });
});

const updateFarmerProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const farmerId = req.user._id;

  // Get existing product first
  const existingProduct = await FarmerProduct.findOne({ _id: productId, farmerId });
  
  if (!existingProduct) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Handle image upload
  const updateData = { ...req.body };
  
  if (req.file) {
    // Delete old image if exists
    if (existingProduct.imageUrl) {
      const oldImagePath = path.join(__dirname, '..', existingProduct.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updateData.imageUrl = `/uploads/products/${req.file.filename}`;
  }

  const updatedProduct = await FarmerProduct.findOneAndUpdate(
    { _id: productId, farmerId },
    updateData,
    { new: true }
  );

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.UPDATED, {
    product: updatedProduct
  });
});

const deleteFarmerProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const farmerId = req.user._id;

  const deleted = await FarmerProduct.findOneAndDelete({ _id: productId, farmerId });
  
  if (!deleted) {
    throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Delete associated image if exists
  if (deleted.imageUrl) {
    const imagePath = path.join(__dirname, '..', deleted.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.DELETED, {
    product: deleted
  });
});

const getFarmerSalesAnalytics = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  const sales = await analyticsService.getFarmerSalesAnalytics(farmerId);
  
  sendSuccess(res, HTTP_STATUS.OK, 'Farmer sales analytics', { data: sales });
});

module.exports = {
  getFarmerSalesAnalytics,
  createFarmerProduct,
  getMyFarmerProducts,
  updateFarmerProduct,
  deleteFarmerProduct
};
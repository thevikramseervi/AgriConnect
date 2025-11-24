const { VendorProduct } = require('../models');
const { asyncHandler, sendSuccess, AppError } = require('../utils/errorHandler');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const PurchaseService = require('../services/purchaseService');
const analyticsService = require('../services/analyticsService');

const purchaseFromFarmer = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const vendorId = req.user._id;

  const result = await PurchaseService.purchaseFromFarmer(vendorId, productId, quantity);
  
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.PURCHASE.SUCCESS, {
    vendorProduct: result.vendorProduct
  });
});

const getVendorProduct = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const vendorProduct = await VendorProduct.find({ vendorId });
  
  // Return empty array instead of error when no products found
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.FETCHED, { vendorProduct });
});

const getVendorSalesAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const sales = await analyticsService.getVendorSalesAnalytics(vendorId);
  
  sendSuccess(res, HTTP_STATUS.OK, 'Vendor sales analytics', { data: sales });
});

const getVendorExpenditureAnalytics = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const purchase = await analyticsService.getVendorExpenditureAnalytics(vendorId);
  
  sendSuccess(res, HTTP_STATUS.OK, 'Vendor expenditure analytics', { data: purchase });
});

module.exports = {
  getVendorSalesAnalytics,
  getVendorExpenditureAnalytics,
  purchaseFromFarmer,
  getVendorProduct
};

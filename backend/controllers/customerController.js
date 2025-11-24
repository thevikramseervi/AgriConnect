const { asyncHandler, sendSuccess } = require('../utils/errorHandler');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const PurchaseService = require('../services/purchaseService');
const analyticsService = require('../services/analyticsService');

const purchaseFromVendor = asyncHandler(async (req, res) => {
  const { address, items } = req.body;
  const customerId = req.user._id;
  const locality = req.user.locality;

  const result = await PurchaseService.purchaseFromVendor(customerId, locality, address, items);
  
  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.ORDER.CREATED, {
    orderId: result.order._id
  });
});

const getCustomerExpenditureAnalytics = asyncHandler(async (req, res) => {
  const customerId = req.user._id;
  const spend = await analyticsService.getCustomerExpenditureAnalytics(customerId);
  
  sendSuccess(res, HTTP_STATUS.OK, 'Customer expenditure analytics', { data: spend });
});

module.exports = { purchaseFromVendor, getCustomerExpenditureAnalytics };
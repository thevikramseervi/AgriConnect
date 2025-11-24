const { Order, OrderItem } = require("../models");
const { asyncHandler, sendSuccess, AppError } = require("../utils/errorHandler");
const { HTTP_STATUS, MESSAGES, USER_ROLES } = require("../utils/constants");
const analyticsService = require('../services/analyticsService');

const getOrdersByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ userId });

  if (!orders.length) {
    throw new AppError(MESSAGES.ORDER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER.FETCHED, { orders });
});

const getDashboardByRole = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const userId = req.user._id;

  let data;

  switch (role) {
    case USER_ROLES.FARMER:
      data = await analyticsService.getFarmerSalesAnalytics(userId);
      return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ANALYTICS.SUCCESS, { data });

    case USER_ROLES.VENDOR:
      const sales = await analyticsService.getVendorSalesAnalytics(userId);
      const purchase = await analyticsService.getVendorExpenditureAnalytics(userId);
      return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ANALYTICS.SUCCESS, {
        sales,
        purchase
      });

    case USER_ROLES.CUSTOMER:
      data = await analyticsService.getCustomerExpenditureAnalytics(userId);
      return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ANALYTICS.SUCCESS, { data });

    default:
      throw new AppError(MESSAGES.COMMON.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
  }
});

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError(MESSAGES.ORDER.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const items = await OrderItem.find({ orderId });
  
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.ORDER.FETCHED, { order, items });
});

module.exports = { getOrdersByUser, getDashboardByRole, getOrderDetails };
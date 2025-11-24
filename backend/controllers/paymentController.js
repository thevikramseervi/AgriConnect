const { Payment } = require('../models');
const { asyncHandler, sendSuccess, AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const payment = await Payment.findOne({ orderId });
  if (!payment) {
    throw new AppError('No payment found for this order', HTTP_STATUS.NOT_FOUND);
  }

  sendSuccess(res, HTTP_STATUS.OK, 'Payment status fetched', {
    status: payment.status
  });
});

const getPaymentsByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const payments = await Payment.find({
    $or: [{ from: userId }, { to: userId }]
  });

  if (!payments.length) {
    throw new AppError('No payments found for this user', HTTP_STATUS.NOT_FOUND);
  }

  const paymentDebited = payments.filter(p => p.from.toString() === userId.toString());
  const paymentCredited = payments.filter(p => p.to.toString() === userId.toString());

  sendSuccess(res, HTTP_STATUS.OK, 'Payments fetched successfully', {
    paymentDebited,
    paymentCredited
  });
});

module.exports = { getPaymentStatus, getPaymentsByUser };
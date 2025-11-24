const mongoose = require('mongoose');
const { VendorProduct, OrderItem, Order } = require('../models');

/**
 * Reusable analytics service for aggregations
 */

const getAnalyticsByDateGroup = async (Model, matchConditions, sumFields) => {
  const pipeline = [
    { $match: matchConditions }
  ];

  // Add lookup if specified
  if (sumFields.lookup) {
    pipeline.push({
      $lookup: sumFields.lookup
    });
    pipeline.push({ $unwind: `$${sumFields.lookup.as}` });
    
    if (sumFields.nestedMatch) {
      pipeline.push({ $match: sumFields.nestedMatch });
    }
  }

  // Group by date
  pipeline.push({
    $group: {
      _id: {
        day: { $dayOfMonth: sumFields.dateField || '$createdAt' },
        month: { $month: sumFields.dateField || '$createdAt' },
        year: { $year: sumFields.dateField || '$createdAt' }
      },
      ...sumFields.aggregations
    }
  });

  // Sort by date descending
  pipeline.push({
    $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 }
  });

  return await Model.aggregate(pipeline);
};

const getFarmerSalesAnalytics = async (farmerId) => {
  // Convert to ObjectId if string
  const farmerObjectId = typeof farmerId === 'string' 
    ? new mongoose.Types.ObjectId(farmerId) 
    : farmerId;

  return await getAnalyticsByDateGroup(
    VendorProduct,
    {},
    {
      lookup: {
        from: 'farmerproducts',
        localField: 'linkedFarmersProductId',
        foreignField: '_id',
        as: 'FarmerProduct'
      },
      nestedMatch: { 'FarmerProduct.farmerId': farmerObjectId },
      dateField: '$FarmerProduct.createdAt',
      aggregations: {
        totalQuantity: { $sum: '$quantity' },
        totalRevenue: { $sum: { $multiply: ['$pricePerUnit', '$quantity'] } }
      }
    }
  );
};

const getVendorSalesAnalytics = async (vendorId) => {
  // Convert to ObjectId if string
  const vendorObjectId = typeof vendorId === 'string' 
    ? new mongoose.Types.ObjectId(vendorId) 
    : vendorId;

  return await getAnalyticsByDateGroup(
    OrderItem,
    {},
    {
      lookup: {
        from: 'vendorproducts',
        localField: 'productId',
        foreignField: '_id',
        as: 'VendorProduct'
      },
      nestedMatch: { 'VendorProduct.vendorId': vendorObjectId },
      dateField: '$VendorProduct.createdAt',
      aggregations: {
        totalQuantitySold: { $sum: '$quantity' },
        totalRevenue: { $sum: '$subTotal' }
      }
    }
  );
};

const getVendorExpenditureAnalytics = async (vendorId) => {
  // Convert to ObjectId if string
  const vendorObjectId = typeof vendorId === 'string' 
    ? new mongoose.Types.ObjectId(vendorId) 
    : vendorId;

  return await getAnalyticsByDateGroup(
    VendorProduct,
    { vendorId: vendorObjectId },
    {
      aggregations: {
        totalQuantityPurchased: { $sum: '$quantity' },
        totalSpent: { $sum: { $multiply: ['$pricePerUnit', '$quantity'] } }
      }
    }
  );
};

const getCustomerExpenditureAnalytics = async (customerId) => {
  // Convert to ObjectId if string
  const customerObjectId = typeof customerId === 'string' 
    ? new mongoose.Types.ObjectId(customerId) 
    : customerId;

  return await getAnalyticsByDateGroup(
    Order,
    { userId: customerObjectId },
    {
      aggregations: {
        totalSpent: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    }
  );
};

module.exports = {
  getFarmerSalesAnalytics,
  getVendorSalesAnalytics,
  getVendorExpenditureAnalytics,
  getCustomerExpenditureAnalytics
};


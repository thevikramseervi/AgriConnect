const { FarmerProduct, VendorProduct } = require('../models');
const { asyncHandler, sendSuccess, AppError } = require('../utils/errorHandler');
const { HTTP_STATUS, MESSAGES, USER_ROLES, PRODUCT_STATUS } = require('../utils/constants');

const getAvailableProducts = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const locality = req.user.locality;
  
  const availableStatuses = [PRODUCT_STATUS.PARTIAL, PRODUCT_STATUS.AVAILABLE];

  if (role === USER_ROLES.VENDOR) {
    const products = await FarmerProduct.find({
      status: { $in: availableStatuses }
    });
    console.log(`[VENDOR] Found ${products.length} farmer products with status:`, availableStatuses);
    console.log('[VENDOR] Products:', products.map(p => ({ name: p.name, status: p.status, quantity: p.quantity })));
    return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.FETCHED, { products });
  }
  
  if (role === USER_ROLES.CUSTOMER) {
    const products = await VendorProduct.find({
      status: { $in: availableStatuses },
      locality
    });

    const otherLocalityProducts = await VendorProduct.find({
      status: { $in: availableStatuses },
      locality: { $ne: locality }
    });
    
    return sendSuccess(res, HTTP_STATUS.OK, MESSAGES.PRODUCT.FETCHED, {
      products,
      otherLocalityProducts
    });
  }

  throw new AppError(MESSAGES.COMMON.FORBIDDEN, HTTP_STATUS.FORBIDDEN);
});

module.exports = { getAvailableProducts };
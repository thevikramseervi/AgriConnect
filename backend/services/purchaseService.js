const { Order, OrderItem, Payment, FarmerProduct, VendorProduct } = require('../models');
const { AppError } = require('../utils/errorHandler');
const { PRODUCT_STATUS, PAYMENT_STATUS, HTTP_STATUS, MESSAGES } = require('../utils/constants');

/**
 * Service layer for purchase operations
 */

class PurchaseService {
  /**
   * Update product quantity and status
   */
  static async updateProductStock(product, quantityPurchased) {
    product.quantity -= quantityPurchased;
    product.status = product.quantity === 0 ? PRODUCT_STATUS.SOLD : PRODUCT_STATUS.PARTIAL;
    await product.save();
  }

  /**
   * Create order, order items, and payment records
   */
  static async createOrderTransaction(orderData) {
    const { userId, totalAmount, locality, address, items, sellerId } = orderData;

    // Create order
    const order = new Order({
      userId,
      totalAmount,
      locality,
      address
    });
    await order.save();

    // Create order items
    const orderItems = [];
    for (const item of items) {
      const orderItem = await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        subTotal: item.subTotal,
        buyerId: userId,
        sellerId: sellerId || item.sellerId
      });
      orderItems.push(orderItem);
    }

    // Create payment
    const payment = await Payment.create({
      orderId: order._id,
      from: userId,
      to: sellerId || items[0].sellerId,
      amount: totalAmount,
      status: PAYMENT_STATUS.SUCCESSFUL
    });

    return { order, orderItems, payment };
  }

  /**
   * Handle vendor purchase from farmer
   * TODO: Add database transactions for atomicity
   */
  static async purchaseFromFarmer(vendorId, productId, quantity) {
    // Validate inputs
    if (!quantity || quantity <= 0) {
      throw new AppError('Invalid quantity', HTTP_STATUS.BAD_REQUEST);
    }

    // Fetch and validate farmer product
    const farmerProduct = await FarmerProduct.findById(productId);
    
    if (!farmerProduct) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (farmerProduct.quantity < quantity) {
      throw new AppError(
        `${MESSAGES.PRODUCT.INSUFFICIENT_STOCK}. Available: ${farmerProduct.quantity}, Requested: ${quantity}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check for duplicate purchase
    const existingVendorProduct = await VendorProduct.findOne({
      vendorId,
      linkedFarmersProductId: productId
    });

    if (existingVendorProduct) {
      throw new AppError(
        `${MESSAGES.PURCHASE.DUPLICATE_VENDOR}. You already have this product listed.`,
        HTTP_STATUS.CONFLICT
      );
    }

    const totalAmount = quantity * farmerProduct.pricePerUnit;

    // Step 1: Update farmer product stock FIRST (fail early if issue)
    await this.updateProductStock(farmerProduct, quantity);

    let vendorProduct;
    let transaction;

    try {
      // Step 2: Create order transaction
      transaction = await this.createOrderTransaction({
        userId: vendorId,
        totalAmount,
        locality: farmerProduct.locality,
        address: farmerProduct.address,
        items: [{
          productId: farmerProduct._id,
          quantity,
          pricePerUnit: farmerProduct.pricePerUnit,
          subTotal: totalAmount,
          sellerId: farmerProduct.farmerId
        }],
        sellerId: farmerProduct.farmerId
      });

      // Step 3: Create vendor product (last, after payment confirmed)
      vendorProduct = new VendorProduct({
        name: farmerProduct.name,
        pricePerUnit: farmerProduct.pricePerUnit,
        quantity,
        category: farmerProduct.category,
        locality: farmerProduct.locality,
        address: farmerProduct.address,
        vendorId,
        linkedFarmersProductId: productId,
        status: PRODUCT_STATUS.AVAILABLE,
        imageUrl: farmerProduct.imageUrl // Copy image from farmer product
      });
      await vendorProduct.save();

    } catch (error) {
      // Rollback: Restore farmer product stock
      farmerProduct.quantity += quantity;
      farmerProduct.status = farmerProduct.quantity === 0 ? PRODUCT_STATUS.SOLD : PRODUCT_STATUS.PARTIAL;
      await farmerProduct.save();
      
      throw new AppError(
        `Purchase failed: ${error.message}. Stock has been restored.`,
        HTTP_STATUS.INTERNAL_ERROR
      );
    }

    return { vendorProduct, ...transaction };
  }

  /**
   * Handle customer purchase from vendor
   * NOTE: Currently only supports single-vendor purchases
   */
  static async purchaseFromVendor(customerId, locality, address, items) {
    if (!items || items.length === 0) {
      throw new AppError('No items in purchase', HTTP_STATUS.BAD_REQUEST);
    }

    let totalAmount = 0;
    const orderItems = [];
    const vendors = new Set();
    const productIdsInCurrentOrder = new Set();

    // First pass: Validate all items and check for duplicates IN THIS ORDER
    for (const item of items) {
      const product = await VendorProduct.findById(item.vendorProductId);
      
      if (!product) {
        throw new AppError(
          `Product not found: ${item.vendorProductId}`,
          HTTP_STATUS.NOT_FOUND
        );
      }

      if (product.quantity < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      // Check for duplicate in CURRENT order (not all-time purchases)
      if (productIdsInCurrentOrder.has(product._id.toString())) {
        throw new AppError(
          `Duplicate product in order: ${product.name}. Please combine quantities.`,
          HTTP_STATUS.CONFLICT
        );
      }
      productIdsInCurrentOrder.add(product._id.toString());

      // Track vendors
      vendors.add(product.vendorId.toString());
      
      const subTotal = item.quantity * product.pricePerUnit;
      totalAmount += subTotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        pricePerUnit: product.pricePerUnit,
        subTotal,
        sellerId: product.vendorId, // Store individual seller
        product // Keep reference for later update
      });
    }

    // Check if multi-vendor (not currently supported properly)
    if (vendors.size > 1) {
      throw new AppError(
        'Multi-vendor purchases are not currently supported. Please place separate orders for each vendor.',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const vendorId = orderItems[0].sellerId;

    // Create order transaction
    const transaction = await this.createOrderTransaction({
      userId: customerId,
      totalAmount,
      locality,
      address,
      items: orderItems,
      sellerId: vendorId
    });

    // Update all product stocks
    for (const item of orderItems) {
      await this.updateProductStock(item.product, item.quantity);
    }

    return transaction;
  }
}

module.exports = PurchaseService;


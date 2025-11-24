const mongoose = require('mongoose');

const vendorProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: String,
    locality: { type: String, required: true },
    address: { type: String, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    linkedFarmersProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProduct', required: true },
    status: { type: String, enum: ['available', 'sold', 'partial'], default: 'available' },
    imageUrl: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("VendorProduct",vendorProductSchema);
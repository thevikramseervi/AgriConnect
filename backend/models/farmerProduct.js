const mongoose = require('mongoose');

const farmerProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: String,
    locality: { type: String, required: true },
    address: { type: String, required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['available', 'sold', 'partial'], default: 'available' },
    imageUrl: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('FarmerProduct',farmerProductSchema);
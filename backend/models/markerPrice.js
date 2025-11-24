const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    commodity: { type: String, required: true },
    locality: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    source: { type: String, enum: ['AGMARKET', 'Manual'], default: 'AGMARKET' },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  ticker: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  buyPrice: { type: Number, required: true },
  currentPrice: { type: Number },
});

module.exports = mongoose.model('Stock', stockSchema);

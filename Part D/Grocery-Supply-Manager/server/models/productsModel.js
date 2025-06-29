const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentQuantity: { type: Number, default: 0 }, // כמות עדכנית בחנות
  minQuantity: { type: Number, default: 0 }    // כמות מינימלית רצויה
});

module.exports = mongoose.model('Product', productSchema);
  
const mongoose = require('mongoose');

const supplierProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  minQuantity: { type: Number, required: true },
});

const supplierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    phone: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'supplier' },
    products: [supplierProductSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
  });
  
  module.exports = mongoose.model('Supplier', supplierSchema);
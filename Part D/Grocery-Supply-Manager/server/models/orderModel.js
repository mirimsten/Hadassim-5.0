const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['in-progress', 'approved', 'delivered'],
      default: 'in-progress'
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number
      }
    ],
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true } 
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  
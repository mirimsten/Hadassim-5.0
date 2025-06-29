const Product = require('../models/productsModel');
const Supplier = require('../models/supplierModel');
const Order = require('../models/orderModel');
const Notification = require('../models/notificationModel');
const mongoose = require('mongoose');

const handleAutoOrderIfNeeded = async (productId, quantityNeeded) => {
    try {

        const product = await Product.findById(productId);
        const productName = product ? product.name : `מוצר לא ידוע (ID: ${productId})`;

      const suppliers = await Supplier.find({
        'products.product': productId
      });
  
      if (!suppliers.length) {
        const notification = new Notification({
          message: `No supplier sells the product "${productName}" — automatic order cannot be placed.`
        });
        console.log("אין מוצר כזה אצל ספק")
        await notification.save();
        return;
      }

      let cheapestSupplier = null;
      let lowestPrice = Infinity;
  
      for (const supplier of suppliers) {
        const supplierProduct = supplier.products.find(p => p.product.toString() === productId.toString());
        if (supplierProduct && supplierProduct.price < lowestPrice) {
          lowestPrice = supplierProduct.price;
          cheapestSupplier = supplier;
        }
      }
  
      if (!cheapestSupplier) {
        const notification = new Notification({
          message: `שגיאה במציאת מחיר עבור מוצר (ID: ${productId}) — לא בוצעה הזמנה.`
        });
        await notification.save();
        return;
      }

      const newOrder = new Order({
        supplier: cheapestSupplier._id,
        products: [
          {
            product: productId,
            quantity: quantityNeeded
          }
        ],
        status: 'in-progress'
      });
  
      await newOrder.save();
  
      console.log(`הוזמן אוטומטית מהמוצר ${productId} אצל הספק ${cheapestSupplier.companyName}`);
    } catch (error) {
      console.error('שגיאה בהזמנה אוטומטית:', error);
    }
  };


const handleSale = async (req, res) => {
  const saleData = req.body; 

  try {
    const updatedProducts = [];

    for (const [productName, quantitySold] of Object.entries(saleData)) {
      const product = await Product.findOne({ name: new RegExp(`^${productName}$`, 'i') });

      if (!product) {
        console.warn(`Product "${productName}" not found`);
        continue;
      }

       if (quantitySold > product.currentQuantity) {
        errors.push(`Insufficient stock for "${product.name}". Requested: ${quantitySold}, Available: ${product.currentQuantity}`);
        continue;
      }

      console.log("Before update:", product);
      product.currentQuantity = Math.max(0, product.currentQuantity - quantitySold);
      await product.save();
      console.log("After update:", await Product.findById(product._id));
      const isBelowMin = product.currentQuantity < product.minQuantity;
      if (isBelowMin) {
        const quantityNeeded = product.minQuantity - product.currentQuantity;
        await handleAutoOrderIfNeeded(product._id, quantityNeeded);
      }

      updatedProducts.push({ name: product.name, newQuantity: product.currentQuantity });
    }

    res.status(200).json({
      message: 'Stock updated successfully from POS sale',
      updatedProducts
    });
  } catch (err) {
    console.error('Error handling POS sale:', err);
    res.status(500).json({ message: 'Failed to update stock from POS', error: err.message });
  }
};

module.exports = {
  handleSale
};

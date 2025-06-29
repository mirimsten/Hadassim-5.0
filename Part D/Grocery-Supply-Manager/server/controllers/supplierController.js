const Supplier = require('../models/supplierModel');
const Order = require('../models/orderModel');

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().select('companyName'); 
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: 'שגיאה בקבלת הספקים', error: err.message });
  }
};

exports.getProductsBySupplier =  async (req, res) => {
    try {
      const supplier = await Supplier.findById(req.params.supplierId).populate('products.product');
      if (!supplier) {
        return res.status(404).json({ message: 'ספק לא נמצא' });
      }
      const productsInfo = supplier.products.map(item => {
        return {
          productId: item.product._id,
          name: item.product.name,
          minOrderQuantity: item.minQuantity || 1
        };
      });
  
      res.json(productsInfo);
    } catch (err) {
      res.status(500).json({ message: 'שגיאה בקבלת המוצרים של הספק', error: err.message });
    }
  };

  exports.getOrdersBySupplier = async (req, res) => {
    try {
      console.log("ddddddd",req.params.supplierId)
      const supplierId = req.params.supplierId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit

      const totalOrders = await Order.countDocuments({ supplier: supplierId });
      console.log(totalOrders)
  
      const orders = await Order.find({ supplier: supplierId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate('products.product', 'name');

      console.log(orders);
      res.status(200).json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      });

    } catch (err) {
      res.status(500).json({ message: 'שגיאה בשליפת ההזמנות', error: err.message });
    }}
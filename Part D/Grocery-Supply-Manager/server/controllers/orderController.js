const Order = require('../models/orderModel');
const Product = require('../models/productsModel');
const Supplier = require('../models/supplierModel');

const getAllOrders = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; 
      const limit = parseInt(req.query.limit) || 10; 
      const skip = (page - 1) * limit;
  
      const totalOrders = await Order.countDocuments();
  
      const orders = await Order.find()
        .sort({ date: -1 }) 
        .skip(skip)
        .limit(limit)
        .populate('supplier', 'companyName')
        .populate('products.product', 'name');
  
      res.status(200).json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      });
    } catch (err) {
      res.status(500).json({ message: 'שגיאה בשליפת ההזמנות', error: err.message });
    }
  };
  


const addOrder = async (req, res) => {
  try {
    const { supplierId, products } = req.body;

    if (!supplierId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'חובה להזין ספק ומוצרים' });
    }

    const supplierExists = await Supplier.findById(supplierId);
    if (!supplierExists) {
      return res.status(404).json({ message: 'ספק לא נמצא' });
    }

    for (const item of products) {
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(404).json({ message: `מוצר לא נמצא (ID: ${item.product})` });
      }
    }

    const newOrder = new Order({
      supplier: supplierId,
      products: products.map(p => ({
        product: p.product,
        quantity: p.quantity
      }))
    });

    await newOrder.save();
    res.status(201).json({ message: 'ההזמנה נוצרה בהצלחה', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה ביצירת ההזמנה', error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const user = req.user;
  
    if (!status) {
      return res.status(400).json({ message: 'יש לציין סטטוס לעדכון' });
    }
  
    try {
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'הזמנה לא נמצאה' });
      }
      
    if (user.role === 'supplier') {
        if (order.supplier.toString() !== user.id) {
            return res.status(403).json({ message: 'אין לך הרשאה לעדכן הזמנה זו' });
        }
    }

      if (status === 'delivered' && order.status !== 'approved') {
        return res.status(400).json({ message: 'ניתן לסמן כהוזמנה שהתקבלה רק אם אושרה קודם' });
      }
  
      order.status = status;
      await order.save();
      if (status === 'delivered') {
        for (const item of order.products) {
          const product = await Product.findById(item.product);
          if (product) {
            product.currentQuantity += item.quantity;
            await product.save();
          }
        }
      }
  
      res.status(200).json({ message: 'הסטטוס עודכן בהצלחה', order });
    } catch (err) {
      res.status(500).json({ message: 'שגיאה בעדכון הסטטוס', error: err.message });
    }
  };

  const getSingleOrder = async (req, res) => {
    try {
        console.log('ORDER ID שהתקבל:', req.params.orderId);
      const order = await Order.findById(req.params.orderId)
        .populate('supplier', 'companyName')
        .populate('products.product', 'name');
  
      if (!order) {
        return res.status(404).json({ message: 'הזמנה לא נמצאה' });
      }

    if (req.user.role === 'admin') {
      return res.status(200).json(order);
    }

    if (req.user.role === 'supplier') {
      if (order.supplier && order.supplier._id.toString() === req.user.id) {
        return res.status(200).json(order);
      } else {
        return res.status(403).json({ message: 'אין לך הרשאה לצפות בהזמנה זו' });
      }
    }

    return res.status(403).json({ message: 'אין לך הרשאה מתאימה' });
    } catch (err) {
      res.status(500).json({ message: 'שגיאה בשליפת ההזמנה', error: err.message });
    }
  };
  

module.exports = {
  getAllOrders,
  addOrder,
  updateOrderStatus,
  getSingleOrder
};

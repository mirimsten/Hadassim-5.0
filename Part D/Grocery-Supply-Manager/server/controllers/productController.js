const Product = require('../models/productsModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name } = req.body;
  try {
    const newProduct = new Product({ name });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
};

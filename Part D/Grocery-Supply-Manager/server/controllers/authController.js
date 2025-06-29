
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const Supplier = require('../models/supplierModel');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

exports.login = async (req, res) => {
  console.log("auth.controller.js loaded");
  const { email, password } = req.body;
  console.log('Login attempt with:', email, password);

  try {
    let user = await Admin.findOne({ email });
    console.log('Admin found:', user);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const token = jwt.sign({ id: user._id, role: 'admin' }, JWT_SECRET);
      return res.json({ token, role: 'admin' });
    }

    user = await Supplier.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const token = jwt.sign({ id: user._id, role: 'supplier' }, JWT_SECRET);
      return res.json({ token, role: 'supplier' });
    }

    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.registerSupplier = async (req, res) => {
    const { companyName, phone, representativeName, email, password, products } = req.body;
  
    try {
      const existing = await Supplier.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Supplier already exists' });
  
      const passwordHash = await bcrypt.hash(password, 10);
  
      const newSupplier = new Supplier({
        companyName,
        phone,
        contactName: representativeName,
        email,
        passwordHash,
        products
      });
  
      console.log('Saving supplier:', {
        companyName,
        phone,
        contactName: representativeName,
        email,
        passwordHash,
        products
      });
      

      await newSupplier.save();
  
      const token = jwt.sign({ id: newSupplier._id, role: 'supplier' }, JWT_SECRET);
      res.status(201).json({ token, role: 'supplier' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

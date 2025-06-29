const express = require('express');
const router = express.Router();
const { getAllSuppliers, getProductsBySupplier, getOrdersBySupplier } = require('../controllers/supplierController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/', authenticateToken, authorizeRole('admin'), getAllSuppliers)
router.get('/:supplierId/products', authenticateToken, getProductsBySupplier);
router.get('/:supplierId/orders',authenticateToken, authorizeRole('supplier'), getOrdersBySupplier);

module.exports = router;

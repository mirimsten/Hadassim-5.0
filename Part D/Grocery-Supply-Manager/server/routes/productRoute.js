const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct } = require('../controllers/productController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/', authenticateToken, getAllProducts);
router.get('/public', getAllProducts);
router.post('/', authenticateToken, authorizeRole('admin'), addProduct); 


module.exports = router;

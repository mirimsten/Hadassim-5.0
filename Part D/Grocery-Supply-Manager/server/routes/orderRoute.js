const express = require('express');
const router = express.Router();
const { getAllOrders, addOrder, updateOrderStatus, getSingleOrder } = require('../controllers/orderController');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const { validateOrder } = require('../middlewares/validationMiddleware');

router.get('/', authenticateToken, authorizeRole('admin'), getAllOrders);
router.get('/:orderId', authenticateToken, getSingleOrder);
router.post('/', authenticateToken, authorizeRole('admin'), validateOrder, addOrder);
router.put('/:orderId/status', authenticateToken, updateOrderStatus);

module.exports = router;
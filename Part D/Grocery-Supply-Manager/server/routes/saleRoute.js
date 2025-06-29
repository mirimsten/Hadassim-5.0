const express = require('express');
const router = express.Router();
const { handleSale } = require('../controllers/saleController');
const {validateSale} = require('../middlewares/validationMiddleware');

router.post('/', validateSale, handleSale);

module.exports = router;

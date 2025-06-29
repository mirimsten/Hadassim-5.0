const express = require('express');
const router = express.Router();
const { login, registerSupplier } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validationMiddleware');

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, registerSupplier);

module.exports = router;
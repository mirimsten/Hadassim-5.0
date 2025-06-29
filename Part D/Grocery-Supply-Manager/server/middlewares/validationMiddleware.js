const Joi = require('joi');

// ולידציה לרישום ספק
const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    companyName: Joi.string().min(2).required(),
    phone: Joi.string().pattern(/^[0-9]{9,10}$/).required(),
    representativeName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(), 
        price: Joi.number().positive().required(),
        minQuantity: Joi.number().integer().min(1).required()
      })
    )
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(e => e.message);
    return res.status(400).json({ message: 'Validation failed', errors: messages });
  }

  next();
};

// ולידציה ליצירת הזמנה 
const validateOrder = (req, res, next) => {
    const schema = Joi.object({
      supplierId: Joi.string().required(),
      products: Joi.array().min(1).items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required()
        })
      )
    });
  
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors: messages });
    }
  
    next();
  };
  

  // ולידציה ללוגין 
 const validateLogin = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Invalid login data', error: error.details[0].message });
    }
  
    next();
  };
  
  // ולידציה לניהול רכישה מהקופה
  const validateSale = (req, res, next) => {
    const saleSchema = Joi.object().pattern(
      Joi.string(), // שם מוצר
      Joi.number().integer().min(1).required()
    );
  
    const { error } = saleSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const messages = error.details.map(e => e.message);
      return res.status(400).json({ message: 'שגיאה בנתוני המכירה מהקופה', errors: messages });
    }
  
    next();
  };
  
  module.exports = {
    validateRegister,
    validateOrder,
    validateLogin,
    validateSale
  };
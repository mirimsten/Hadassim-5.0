const mongoose = require('mongoose');

const Admin = require('./models/adminModel');
const Supplier = require('./models/supplierModel');
const Product = require('./models/productsModel');
const Order = require('./models/orderModel');
const Notification = require('./models/notificationModel')

// התחברות למסד הנתונים המקומי
mongoose.connect('mongodb://localhost:27017/GroceryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected locally');
})
.catch(err => console.error('Connection error:', err));


///////////////////////////////////////////////////////////



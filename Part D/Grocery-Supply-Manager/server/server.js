const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/notifications', require('./routes/notificationRoute'));
app.use('/', require('./routes/authRoute'));
app.use('/products', require('./routes/productRoute'));
app.use('/orders', require('./routes/orderRoute'));
app.use('/suppliers', require('./routes/supplierRoute'));
app.use('/sale',require('./routes/saleRoute'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

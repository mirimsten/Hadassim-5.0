import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Button,
  IconButton,
  Grid,
  Alert
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

function CreateOrder() {

const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderProducts, setOrderProducts] = useState([]);
  const [message, setMessage] = useState('');
 

  useEffect(() => {
    axios.get('http://localhost:5000/suppliers/').then(res => setSuppliers(res.data));
  }, []);

  // כשנבחר ספק – נשלוף את מוצריו
  useEffect(() => {
    if (selectedSupplier) {
      axios.get(`http://localhost:5000/suppliers/${selectedSupplier}/products/`)
        .then(res => {
          setSupplierProducts(res.data);
          setOrderProducts([]);
        })
        .catch(err => setSupplierProducts([]));
    } else {
      setSupplierProducts([]);
    }
  }, [selectedSupplier]);

  const handleAddProduct = () => {
    setOrderProducts([...orderProducts, { productId: '', quantity: '' }]);
  };



  const handleProductChange = (index, field, value) => {
    const newOrder = [...orderProducts];
  
    if (field === 'productId') {
      const selectedProduct = supplierProducts.find(p => p.productId === value);
      const minQuantity = selectedProduct ? selectedProduct.minOrderQuantity  : 1;
  
      newOrder[index].productId = value;
      newOrder[index].quantity = minQuantity; 
      console.log('בחר מוצר:', selectedProduct?.name, 'כמות מינימום:', minQuantity);
    } else {
      newOrder[index][field] = value;
    }
  
    setOrderProducts(newOrder);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedProducts = orderProducts.map(p => ({
        product: p.productId,
        quantity: p.quantity
      }));

      await axios.post('http://localhost:5000/orders', {
        supplierId: selectedSupplier,
        products: formattedProducts
      });

      setMessage('ההזמנה נוצרה בהצלחה!');
      setOrderProducts([{ productId: '', quantity: 0 }]);
      setSelectedSupplier('');
      setSupplierProducts([]);
      navigate('/admin')

    } catch (err) {
      setMessage('שגיאה ביצירת ההזמנה');
    }
  };
  
return (
  <Container maxWidth="md" sx={{ mt: 8 }}>
    <Typography variant="h4" gutterBottom align="center">
      יצירת הזמנת סחורה מספק
    </Typography>

    <form onSubmit={handleSubmit}>
  <FormControl fullWidth margin="normal">
    <InputLabel>בחר ספק</InputLabel>
    <Select
      value={selectedSupplier}
      onChange={(e) => setSelectedSupplier(e.target.value)}
      required
      label="בחר ספק"
    >
      {suppliers.map(s => (
        <MenuItem key={s._id} value={s._id}>
          {s.companyName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {selectedSupplier && (
    <>
      {orderProducts.map((op, idx) => {
        const selectedProduct = supplierProducts.find(p => p.productId === op.productId);
        const minQuantity = selectedProduct?.minOrderQuantity || 1;

        return (
          <Grid container spacing={2} key={idx} alignItems="center" sx={{ mt: 1 }}>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <InputLabel>בחר מוצר</InputLabel>
                <Select
                  value={op.productId}
                  onChange={(e) => handleProductChange(idx, 'productId', e.target.value)}
                  required
                  label="בחר מוצר"
                >
                  {supplierProducts.map(p => (
                    <MenuItem key={p.productId} value={p.productId}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                type="number"
                label="Qty:"
                value={op.quantity}
                required
                fullWidth
                inputProps={{ min: minQuantity }}
                onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  if (val < minQuantity) {
                    handleProductChange(idx, 'quantity', minQuantity);
                  }
                }}
              />
            </Grid>
          </Grid>
        );
      })}

      <Box mt={2}>
        <IconButton onClick={handleAddProduct} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>

      <Box mt={4}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          בצע הזמנה
        </Button>
      </Box>

      {message && (
        <Box mt={3}>
          <Alert severity={message.includes('שגיאה') ? 'error' : 'success'}>
            {message}
          </Alert>
        </Box>
      )}
    </>
  )}
</form>

  </Container>
);
}

export default CreateOrder;



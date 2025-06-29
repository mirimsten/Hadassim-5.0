
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider
} from '@mui/material';
import SupplierProductForm from './SupplierProductForm';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    representativeName: '',
    email: '',
    password: '',
    products: []
  });

  const [message, setMessage] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products/public')
      .then(res => {
        console.log('Products from server:', res.data)
        setAllProducts(res.data)})
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { product: '', price: '', minQuantity: '' }]
    }));
  };

  const removeProduct = (index) => {
    const updated = [...formData.products];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, products: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      localStorage.setItem('token', res.data.token);
      setMessage('Registration successful!');
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, mt: 6 }}>
        <Typography variant="h5" gutterBottom align="center">
          הרשמה כספק חדש
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="companyName"
              label="שם חברה"
              value={formData.companyName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="phone"
              label="טלפון"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="representativeName"
              label="שם נציג"
              value={formData.representativeName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="אימייל"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="סיסמה"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">מוצרים שתספק:</Typography>

            <SupplierProductForm
              products={formData.products}
              allProducts={allProducts}
              onChange={handleProductChange}
              onAdd={addProduct}
              onRemove={removeProduct}
            />

            <Button variant="contained" color="primary" type="submit">
              הירשם
            </Button>

            {message && (
              <Alert severity={message.includes('success') ? 'success' : 'error'}>
                {message}
              </Alert>
            )}
          </Box>
        </form>
      </Paper>
      <Box mt={3} display="flex" justifyContent="center">
        <BackButton />
      </Box>
    </Container>
  );
}

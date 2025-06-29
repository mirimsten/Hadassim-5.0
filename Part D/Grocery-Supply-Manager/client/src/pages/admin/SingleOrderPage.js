import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './SingleOrderPage.css';
import BackButton from '../../components/BackButton';
import {
  Container,
  Paper,
  Typography,
  Chip,
  Button,
  List,
  ListItem,
  Box,
  Divider,
  Alert
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import InventoryIcon from '@mui/icons-material/Inventory';
import dayjs from 'dayjs';
  

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function SingleOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setMessage('שגיאה בשליפת ההזמנה');
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrder((prev) => ({ ...prev, status: newStatus }));
      setMessage(
        newStatus === 'approved'
          ? 'ההזמנה אושרה בהצלחה'
          : 'הסטטוס עודכן ל-"סופקה"'
      );
    } catch (err) {
      setMessage('שגיאה בעדכון הסטטוס');
    }
  };

  if (!order) return <p>טוען...</p>;

return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 6 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
        <Box display="flex" gap={4} flexDirection={{ xs: 'column', md: 'row' }}>
          <Box flex={1} display="flex" flexDirection="column" justifyContent="center"
            alignItems="center" textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              order details
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Order No.:</strong> #{order._id.slice(-6)}
            </Typography>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <CalendarTodayIcon fontSize="small" />
              <Typography variant="body2">
                {dayjs(order.date).format('DD/MM/YYYY')}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={1}
              mb={1}
            >
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">
                {order.supplier?.companyName || 'ספק לא ידוע'}
              </Typography>
            </Box>

            <Box my={2}>
              <Chip
                label={order.status}
                color={
                  order.status === 'delivered'
                    ? 'success'
                    : order.status === 'approved'
                    ? 'warning'
                    : 'default'
                }
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {order.status === 'approved' && role === 'admin' && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleUpdateStatus('delivered')}
                >
                  Mark as Delivered
                </Button>
             </Box>
            )}
            {order.status === 'in-progress' && role === 'supplier' && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateStatus('approved')}
                >
                 אשר את ההזמנה
                </Button>
              </Box>
            )}
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          <Box flex={1}>
            <Typography variant="h6" align="center" gutterBottom>
              Products:
            </Typography>
            <List dense>
              {order.products.map((p, i) => (
                <ListItem
                  key={i}
                  sx={{
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    mb: 1,
                    py: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <InventoryIcon color="primary" sx={{ mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {p.product?.name || 'שם מוצר לא ידוע'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    qty: {p.quantity}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {message && (
          <Box mt={3}>
            <Alert severity={message.includes('שגיאה') ? 'error' : 'success'}>
              {message}
            </Alert>
          </Box>
        )}
      </Paper>

      <Box mt={3} display="flex" justifyContent="center">
        <BackButton />
      </Box>
    </Container>
  );
}

export default SingleOrderPage;

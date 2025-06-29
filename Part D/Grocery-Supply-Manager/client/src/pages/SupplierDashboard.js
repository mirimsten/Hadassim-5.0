
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Alert,
  Pagination,
} from '@mui/material';
import { motion } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';
//import './SupplierDashboard.css';
import { useNavigate } from 'react-router-dom';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function SupplierDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const supplierId = localStorage.getItem('supplierId');

  const fetchOrders = async (page) => {
    try {
      const res = await axios.get(`http://localhost:5000/suppliers/${supplierId}/orders?page=${page}&limit=4`);
      setOrders(res.data.orders);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setMessage('שגיאה בשליפת ההזמנות');
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [supplierId, currentPage]);

  const handleApproveOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/orders/${orderId}/status`, {
        status: 'approved',
      });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'approved' } : order
        )
      );
      setMessage('ההזמנה אושרה בהצלחה');
    } catch (err) {
      setMessage('שגיאה באישור ההזמנה');
    }
  };

  const handleDoubleClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return 'warning';
    if (status === 'delivered') return 'success';
    if (status === 'in-progress') return 'default';
    return 'default';
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        backgroundColor: '#f5f5f7',
        minHeight: '100vh',
        pb: 5,
        pt: 5,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', mb: 6 }}
      >
        Supplier Orders
      </Typography>

      {message && (
        <Box my={2}>
          <Alert severity={message.includes('שגיאה') ? 'error' : 'success'}>
            {message}
          </Alert>
        </Box>
      )}

      <Grid container spacing={4}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order._id}>
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
              style={{ borderRadius: 12 }}
            >
              <Card
                onDoubleClick={() => handleDoubleClick(order._id)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 3,
                  boxShadow: 6,
                  cursor: 'pointer',
                  py: 3,
                  px: 2,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 8,
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    bgcolor: 'grey.400',
                  }}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    Order #{order._id.slice(-6)}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 1,
                      color: 'text.secondary',
                    }}
                  >
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">
                      {dayjs(order.date).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 1,
                    }}
                  >
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', gap: 1 }}>
  <Button
    variant="outlined"
    size="small"
    onClick={() => navigate(`/orders/${order._id}`)}
  >
    select
  </Button>
</CardActions>

              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {orders.length === 0 && (
        <Typography align="center" sx={{ mt: 5 }} variant="h6">
          אין הזמנות להצגה
        </Typography>
      )}

      <Box mt={6} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </Container>
  );
}

export default SupplierDashboard;


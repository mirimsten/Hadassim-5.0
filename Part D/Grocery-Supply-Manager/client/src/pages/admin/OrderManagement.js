
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './OrdersList.css';
import BackButton from '../../components/BackButton';
import {
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    Grid,
    Alert,
    Chip,
    Pagination,
  } from '@mui/material';
  
  import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
  import BusinessIcon from '@mui/icons-material/Business';
 
  
  import { motion } from 'framer-motion';
  import dayjs from 'dayjs';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async (page) => {
    try {
      const res = await axios.get(`http://localhost:5000/orders?page=${page}&limit=4`);
      setOrders(res.data.orders);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
        setError('שגיאה בטעינת ההזמנות');
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleDoubleClick = (orderId) => {
    navigate(`/orders/${orderId}`);
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
        Order Management
      </Typography>

      {error && (
        <Box my={2}>
          <Alert severity="error">{error}</Alert>
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
                    bgcolor:
                     'grey.400',
                  }}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    order num #{order._id.slice(-6)}
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
                      {dayjs(order.createdAt).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>

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
                    <BusinessIcon fontSize="small" />
                    <Typography variant="body2">
                      {order.supplier?.companyName || 'לא ידוע'}
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
                      color={
                        order.status === 'delivered'
                          ? 'success'       
                          : order.status === 'approved'
                          ? 'warning'
                          : order.status === 'in-progress'
                          ? 'default'      
                          : 'default'
                      }
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button
                    variant="contained"
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

        {orders.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" variant="h6" sx={{ mt: 4 }}>
              no orders
            </Typography>
          </Grid>
        )}
      </Grid>

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
      <Box mt={3} display="flex" justifyContent="center">
        <BackButton />
      </Box>
    </Container>
  );
}

export default OrderManagement;

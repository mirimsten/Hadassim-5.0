import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function AdminDashboard() {
  const navigate = useNavigate();

return (
  <Container maxWidth="md" sx={{ mt: 8 }}>
    <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
      Welcome to the Admin dashboard
    </Typography>

    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Card elevation={3}>
          <CardActionArea onClick={() => navigate('/admin/create-order')}>
            <CardContent>
              <Typography variant="h6" align="center">
                Create Order
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card elevation={3}>
          <CardActionArea onClick={() => navigate('/admin/orders-management')}>
            <CardContent>
              <Typography variant="h6" align="center">
                Orders Managment
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>

    <Grid item xs={12} sm={6}>
      <Card elevation={3}>
        <CardActionArea onClick={() => navigate('/admin/notifications')}>
          <CardContent>
            <Typography variant="h6" align="center">
              Notifications
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>

    <Box mt={6} textAlign="center">
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  </Container>
);
}

export default AdminDashboard;




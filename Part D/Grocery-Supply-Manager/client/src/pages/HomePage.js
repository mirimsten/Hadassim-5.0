// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('supplierId');
    localStorage.removeItem('adminId');
  }, []);

  function getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("wwww:",email,password)
      const res = await axios.post('http://localhost:5000/login', { email, password });
      const { token, role } = res.data;
      const userId = getUserIdFromToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (role === 'supplier') {
        localStorage.setItem('supplierId', userId);
        navigate('/supplier-dashboard');}
      else if (role === 'admin') {
        localStorage.setItem('adminId', userId);
        navigate('/admin');
      }
    } catch (err) {
      alert('Login failed. Please check your credentials.');
    }
  };

return (
  <Container maxWidth="sm">
    <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
      <Typography variant="h5" align="center" gutterBottom>
        כניסה למערכת
      </Typography>
      <form onSubmit={handleLogin}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            type="email"
            label="אימייל"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="password"
            label="סיסמה"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit">
            Log in
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/register')}>
              לא רשום? עבור להרשמה
            </Button>

        </Box>
      </form>
    </Paper>
  </Container>
);
}

export default HomePage;
// src/components/Auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Box
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(String(errorMessage));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '80vh' }}>
      <Grid container sx={{ minHeight: '80vh' }}>
        {/* Left Column: Form */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            p: { xs: 2, md: 8 },
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            {error && (
              <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Email"
                name="email"
                fullWidth
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={handleChange}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Login
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: empty so background is visible */}
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            // This space is intentionally left empty
            // so the background image remains visible
          }} 
        />
      </Grid>
    </Container>
  );
};

export default Login;

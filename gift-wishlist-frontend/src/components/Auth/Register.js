// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Box
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await axios.post('http://localhost:8080/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
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
              Register
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
                label="Name"
                name="name"
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                name="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Register
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

export default Register;

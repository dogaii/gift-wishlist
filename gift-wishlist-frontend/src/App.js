// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Dashboard from './pages/Dashboard';
import WishlistDetail from './pages/WishlistDetail';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log("App mounted, token:", token);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* 1) New Nav Bar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#333',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {/* Left side: Brand name or logo */}
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: '"Dancing Script", cursive',
              fontWeight: 'bold',
            }}
          >
            Gift Wishlist
          </Typography>

          {/* Right side: conditional links/buttons */}
          {!token ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/')}
                sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.1rem' }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate('/register')}
                sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.1rem' }}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/dashboard')}
                sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.1rem' }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.1rem' }}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* 2) Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist/:id"
            element={
              <ProtectedRoute>
                <WishlistDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* 3) Footer */}
      <footer className="footer">
        <p>&copy; 2025 Gift Wishlist App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

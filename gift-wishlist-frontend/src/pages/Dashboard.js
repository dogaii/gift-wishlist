// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// 1) Import an icon for the title
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

const Dashboard = () => {
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/wishlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlists(res.data);
    } catch (err) {
      setMessage('Error fetching wishlists');
      setSnackbarOpen(true);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setNewWishlistName('');
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
      setMessage('Please enter a valid wishlist name.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/wishlists',
        { name: newWishlistName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wishlist created successfully!');
      setSnackbarOpen(true);
      setNewWishlistName('');
      setShowForm(false);
      fetchWishlists();
    } catch (err) {
      setMessage('Error creating wishlist');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlists/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wishlist deleted successfully!');
      setSnackbarOpen(true);
      fetchWishlists();
    } catch (err) {
      setMessage('Error deleting wishlist');
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '80vh' }}>
      <Grid container sx={{ minHeight: '80vh' }}>
        {/* Left column: Dashboard content */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
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
            }}
          >
            {/* 2) Add the icon & styling for the title */}
            <Typography
              variant="h4"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#e73827',           // matches your brand color
                fontFamily: '"Dancing Script", cursive', // or your desired font
                fontWeight: 700,
                mb: 2
              }}
            >
              <CardGiftcardIcon fontSize="large" />
              My Wishlists
            </Typography>

            {wishlists.length > 0 ? (
              <List sx={{ mb: 2 }}>
                {wishlists.map((wishlist) => (
                  <ListItem
                    key={wishlist.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteWishlist(wishlist.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Link
                          to={`/wishlist/${wishlist.id}`}
                          style={{ textDecoration: 'none', color: '#e73827' }}
                        >
                          {wishlist.name}
                        </Link>
                      }
                      secondary={wishlist.userEmail}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography sx={{ mb: 2 }}>No wishlists found.</Typography>
            )}

            <Box textAlign="center" sx={{ mb: 2 }}>
              <Button variant="contained" onClick={toggleForm}>
                {showForm ? 'Cancel' : 'Create New Wishlist'}
              </Button>
            </Box>

            {showForm && (
              <Box
                component="form"
                onSubmit={handleCreateWishlist}
                sx={{ display: 'flex', gap: 2, mb: 4 }}
              >
                <TextField
                  label="Wishlist Name"
                  variant="outlined"
                  value={newWishlistName}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  required
                  fullWidth
                />
                <Button variant="contained" type="submit" color="primary">
                  Save
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right column: empty for background visibility */}
        <Grid item xs={12} md={6} />
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
      />
    </Container>
  );
};

export default Dashboard;

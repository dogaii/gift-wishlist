// src/pages/WishlistDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done'; // Check icon

const WishlistDetail = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchWishlistDetails();
  }, [id]);

  const fetchWishlistDetails = async () => {
    try {
      setLoading(true);
      const wishlistRes = await axios.get(`http://localhost:8080/api/wishlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlistRes.data);

      const itemsRes = await axios.get('http://localhost:8080/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('All items from backend:', itemsRes.data);
      const filteredItems = itemsRes.data.filter(
        (item) => item.wishlistId && String(item.wishlistId) === id
      );
      console.log('Filtered items for wishlist', id, filteredItems);
      setItems(filteredItems);
      
      setMessage('');
    } catch (err) {
      console.error('Error fetching wishlist details:', err.response?.data || err.message);
      setMessage('Error fetching wishlist details: ' + (err.response?.data?.message || err.message));
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  };

  // Updated function to toggle purchased status using isPurchased
  const handleTogglePurchased = async (itemId, currentStatus) => {
    console.log("handleTogglePurchased called with:", itemId, currentStatus);
  
    try {
      // Right before the PUT call, log the URL
      console.log("Using itemId in the URL =>", `http://localhost:8080/api/items/${itemId}`);
  
      await axios.put(
        `http://localhost:8080/api/items/${itemId}`,
        { isPurchased: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error updating purchased status:', err.response?.data || err.message);
      setMessage('Error updating purchased status: ' + (err.response?.data?.message || err.message));
      setSnackbarOpen(true);
    }
  };
  

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setMessage('');
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemLink.trim()) {
      setMessage('Please provide a valid item name and link.');
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/items',
        { name: newItemName, link: newItemLink, wishlistId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Item added successfully!');
      setSnackbarOpen(true);
      setNewItemName('');
      setNewItemLink('');
      setShowForm(false);
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err.message);
      setMessage('Error creating item: ' + (err.response?.data?.message || err.message));
      setSnackbarOpen(true);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Item deleted successfully!');
      setSnackbarOpen(true);
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error deleting item:', err.response?.data || err.message);
      setMessage('Error deleting item: ' + (err.response?.data?.message || err.message));
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          &larr; Back
        </Button>
        <Typography>Loading wishlist details...</Typography>
      </Container>
    );
  }

  if (!wishlist) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          &larr; Back
        </Button>
        <Typography>{message || 'Wishlist not found'}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        {wishlist.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        User: {wishlist.userEmail}
      </Typography>

      {message && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {message}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        Items
      </Typography>
      <Card sx={{ mb: 2, backgroundColor: '#fafafa' }}>
        <CardContent>
          {items.length > 0 ? (
            <List>
              {items.map((item) => (
                <ListItem key={item.id} divider>
                  <ListItemText
                    primary={
                      <span style={{
                        textDecoration: item.isPurchased ? 'line-through' : 'none',
                        color: item.isPurchased ? 'gray' : 'inherit'
                      }}>
                        {item.name}
                      </span>
                    }
                    secondary={item.isPurchased ? "Purchased" : item.link}
                  />
                  {/* Toggle Purchased Button */}
                  <IconButton
                    edge="end"
                    onClick={() => handleTogglePurchased(item.id, item.isPurchased)}
                  >
                    <DoneIcon color={item.isPurchased ? "success" : "disabled"} />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No items found for this wishlist.</Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Add New Item
      </Typography>
      <Button variant="contained" color="primary" onClick={toggleForm} sx={{ mb: 2 }}>
        {showForm ? 'Cancel' : 'Show Form'}
      </Button>
      {showForm && (
        <Box
          component="form"
          onSubmit={handleCreateItem}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            maxWidth: '400px',
          }}
        >
          <TextField
            label="Item Name"
            variant="outlined"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <TextField
            label="Item Link"
            variant="outlined"
            value={newItemLink}
            onChange={(e) => setNewItemLink(e.target.value)}
            required
          />
          <Button variant="contained" type="submit" color="secondary">
            Add Item
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
      />
    </Container>
  );
};

export default WishlistDetail;

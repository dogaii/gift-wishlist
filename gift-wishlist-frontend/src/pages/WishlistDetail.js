import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const WishlistDetail = () => {
  const { id } = useParams(); // wishlist ID
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLink, setNewItemLink] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWishlistDetails();
    // eslint-disable-next-line
  }, [id]);

  const fetchWishlistDetails = async () => {
    try {
      // (Optional) If you have an endpoint like GET /api/wishlists/:id:
      const wishlistRes = await axios.get(`http://localhost:8080/api/wishlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlistRes.data);

      // Get all items, filter by wishlistId
      const itemsRes = await axios.get('http://localhost:8080/api/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredItems = itemsRes.data.filter((item) => item.wishlistId.toString() === id);
      setItems(filteredItems);
    } catch (err) {
      console.error('Error fetching wishlist details:', err.response?.data || err.message);
      setMessage('Error fetching wishlist details');
    }
  };

  // Add a new item to this wishlist
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemLink.trim()) {
      setMessage('Please provide a valid item name and link.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/items',
        {
          name: newItemName,
          link: newItemLink,
          wishlistId: id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Item added successfully!');
      setNewItemName('');
      setNewItemLink('');
      fetchWishlistDetails(); // Refresh items
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err.message);
      setMessage('Error creating item');
    }
  };

  // Delete an item
  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Item deleted successfully!');
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error deleting item:', err.response?.data || err.message);
      setMessage('Error deleting item');
    }
  };

  if (!wishlist) {
    return (
      <div style={{ margin: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          &larr; Back
        </button>
        <p>Loading wishlist details...</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        &larr; Back
      </button>
      <h2>{wishlist.name}</h2>
      <p>User: {wishlist.userEmail}</p>

      {message && <div style={{ marginBottom: '1rem', color: 'red' }}>{message}</div>}

      <h3>Items</h3>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              {item.name}{' '}
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '1rem' }}>
                View Link
              </a>
              <button
                onClick={() => handleDeleteItem(item.id)}
                style={{
                  marginLeft: '1rem',
                  backgroundColor: 'red',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found for this wishlist.</p>
      )}

      <h3>Add New Item</h3>
      <form onSubmit={handleCreateItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          required
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Item Link"
          value={newItemLink}
          onChange={(e) => setNewItemLink(e.target.value)}
          required
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#e73827',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default WishlistDetail;

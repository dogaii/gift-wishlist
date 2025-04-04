import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';

const Dashboard = () => {
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Fetch wishlists when component mounts
  useEffect(() => {
    fetchWishlists();
    // eslint-disable-next-line
  }, []);

  const fetchWishlists = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/wishlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[Dashboard] Fetched wishlists:', res.data);
      setWishlists(res.data);
      setMessage('');
    } catch (err) {
      console.error('[Dashboard] Error fetching wishlists:', err.response?.data || err.message);
      setMessage('Error fetching wishlists');
    }
  };

  // Toggle the "Create New Wishlist" form
  const toggleForm = () => {
    setShowForm(!showForm);
    setNewWishlistName('');
    setMessage('');
  };

  // Handle form submission to create a new wishlist
  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    console.log('[Dashboard] Attempting to create wishlist with name:', newWishlistName);
    if (!newWishlistName.trim()) {
      setMessage('Please enter a valid wishlist name.');
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:8080/api/wishlists',
        { name: newWishlistName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[Dashboard] Response from create wishlist:', res.data);
      setMessage('Wishlist created successfully!');
      setNewWishlistName('');
      setShowForm(false);
      fetchWishlists(); // Refresh the list after creation
    } catch (err) {
      console.error('[Dashboard] Error creating wishlist:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Error creating wishlist');
    }
  };

  // Handle deletion of a wishlist
  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlists/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wishlist deleted successfully!');
      fetchWishlists(); // Refresh the list after deletion
    } catch (err) {
      console.error('[Dashboard] Error deleting wishlist:', err.response?.data || err.message);
      setMessage('Error deleting wishlist');
    }
  };

  return (
    <div style={{ marginLeft: '2rem', marginTop: '2rem' }}>
      <h2>My Wishlists</h2>
      {message && <div style={{ marginBottom: '1rem', color: 'red' }}>{message}</div>}
      <ul>
        {wishlists.map((wishlist) => (
          <li key={wishlist.id} style={{ marginBottom: '0.5rem' }}>
            {/* Wrap wishlist name in a Link to navigate to detail view */}
            <Link
              to={`/wishlist/${wishlist.id}`}
              style={{ marginRight: '0.5rem', cursor: 'pointer', textDecoration: 'underline', color: '#e73827' }}
              onClick={() => console.log(`[Dashboard] Clicked wishlist ${wishlist.id}`)}
            >
              {wishlist.name} - {wishlist.userEmail}
            </Link>
            <button
              onClick={() => handleDeleteWishlist(wishlist.id)}
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

      <button
        onClick={toggleForm}
        style={{
          marginTop: '1rem',
          backgroundColor: '#e73827',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
        }}
      >
        {showForm ? 'Cancel' : 'Create New Wishlist'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateWishlist} style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Wishlist Name"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
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
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;

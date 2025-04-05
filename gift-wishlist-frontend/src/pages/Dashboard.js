import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchWishlists();
    // eslint-disable-next-line
  }, []);

  const fetchWishlists = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/wishlists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlists(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Error fetching wishlists');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setNewWishlistName('');
    setMessage('');
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    if (!newWishlistName.trim()) {
      setMessage('Please enter a valid wishlist name.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8080/api/wishlists',
        { name: newWishlistName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Wishlist created successfully!');
      setNewWishlistName('');
      setShowForm(false);
      fetchWishlists();
    } catch (err) {
      setMessage('Error creating wishlist');
    }
  };

  const handleDeleteWishlist = async (wishlistId) => {
    try {
      await axios.delete(`http://localhost:8080/api/wishlists/${wishlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Wishlist deleted successfully!');
      fetchWishlists();
    } catch (err) {
      setMessage('Error deleting wishlist');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Wishlists</h2>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.card}>
        {wishlists.length > 0 ? (
          <ul style={styles.list}>
            {wishlists.map((wishlist) => (
              <li key={wishlist.id} style={styles.listItem}>
                <Link to={`/wishlist/${wishlist.id}`} style={styles.link}>
                  {wishlist.name} <span style={styles.email}>({wishlist.userEmail})</span>
                </Link>
                <button
                  onClick={() => handleDeleteWishlist(wishlist.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No wishlists found.</p>
        )}
      </div>

      <button onClick={toggleForm} style={styles.addButton}>
        {showForm ? 'Cancel' : 'Create New Wishlist'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateWishlist} style={styles.form}>
          <input
            type="text"
            placeholder="Wishlist Name"
            value={newWishlistName}
            onChange={(e) => setNewWishlistName(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Save
          </button>
        </form>
      )}
    </div>
  );
};

// Example inline styles for a more polished look
const styles = {
  container: {
    margin: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#333',
  },
  message: {
    marginBottom: '1rem',
    color: 'red',
  },
  card: {
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  listItem: {
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    textDecoration: 'none',
    color: '#e73827',
    fontWeight: 'bold',
  },
  email: {
    fontWeight: 'normal',
    fontSize: '0.9rem',
    color: '#555',
  },
  deleteButton: {
    marginLeft: '1rem',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
  },
  addButton: {
    backgroundColor: '#e73827',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  form: {
    marginTop: '1rem',
  },
  input: {
    padding: '0.5rem',
    marginRight: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    backgroundColor: '#5cb85c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Dashboard;

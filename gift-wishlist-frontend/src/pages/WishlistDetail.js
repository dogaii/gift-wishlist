import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
      // Filter items that match this wishlist ID
      const filteredItems = itemsRes.data.filter(
        (item) => item.wishlistId && String(item.wishlistId) === id
      );
      setItems(filteredItems);
      setMessage('');
    } catch (err) {
      console.error('Error fetching wishlist details:', err.response?.data || err.message);
      setMessage(
        'Error fetching wishlist details: ' + (err.response?.data?.message || err.message)
      );
      setWishlist(null);
    } finally {
      setLoading(false);
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
      setShowForm(false);
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error creating item:', err.response?.data || err.message);
      setMessage('Error creating item: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Item deleted successfully!');
      fetchWishlistDetails();
    } catch (err) {
      console.error('Error deleting item:', err.response?.data || err.message);
      setMessage('Error deleting item: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          &larr; Back
        </button>
        <p>Loading wishlist details...</p>
      </div>
    );
  }

  if (!wishlist) {
    return (
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          &larr; Back
        </button>
        <p>{message || 'Wishlist not found'}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        &larr; Back
      </button>
      <h2 style={styles.heading}>{wishlist.name}</h2>
      <p style={styles.subHeading}>User: {wishlist.userEmail}</p>

      {message && <div style={styles.message}>{message}</div>}

      <h3 style={styles.itemsHeading}>Items</h3>
      <div style={styles.card}>
        {items.length > 0 ? (
          <ul style={styles.list}>
            {items.map((item) => (
              <li key={item.id} style={styles.listItem}>
                <div style={{ flexGrow: 1 }}>
                  <strong>{item.name}</strong>{' '}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    View Link
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found for this wishlist.</p>
        )}
      </div>

      <h3 style={styles.addItemHeading}>Add New Item</h3>
      <button onClick={toggleForm} style={styles.showFormButton}>
        {showForm ? 'Cancel' : 'Show Form'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateItem} style={styles.form}>
          <input
            type="text"
            placeholder="Item Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Item Link"
            value={newItemLink}
            onChange={(e) => setNewItemLink(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitButton}>
            Add Item
          </button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    margin: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    marginBottom: '1rem',
    backgroundColor: '#e73827',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
    color: '#333',
  },
  subHeading: {
    marginBottom: '1rem',
    color: '#555',
  },
  message: {
    marginBottom: '1rem',
    color: 'red',
  },
  itemsHeading: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
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
    margin: 0,
  },
  listItem: {
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #eee',
    paddingBottom: '0.5rem',
  },
  link: {
    marginLeft: '0.5rem',
    textDecoration: 'underline',
    color: '#e73827',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    marginLeft: '1rem',
  },
  addItemHeading: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem',
  },
  showFormButton: {
    marginBottom: '1rem',
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
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
  },
  input: {
    padding: '0.5rem',
    marginBottom: '0.5rem',
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
    alignSelf: 'flex-start',
  },
};

export default WishlistDetail;

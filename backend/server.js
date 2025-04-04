// backend/server.js

const cors = require('cors'); // Enable CORS
const express = require('express');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Import models and relationships
const Wishlist = require('./models/Wishlist');
const Item = require('./models/Item');
const User = require('./models/User'); // Include User model for auth

// Define Associations
Wishlist.hasMany(Item, { as: 'items', foreignKey: 'wishlistId' });
Item.belongsTo(Wishlist, { foreignKey: 'wishlistId', as: 'wishlistItem' });

// Import Routes
const wishlistRoutes = require('./routes/wishListRoutes');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');

// Test route to verify API is running
app.get('/test', (req, res) => {
  res.send('✅ API test successful!');
});

// Define API Routes
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

// Sync Models with DB
sequelize
  .sync({ alter: true })
  .then(() => console.log('✅ Database synchronized successfully.'))
  .catch((err) => console.error('❌ Error syncing database:', err));

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define PORT and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

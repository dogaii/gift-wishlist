// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// Get all wishlists
const getWishLists = async (req, res) => {
  try {
    // Retrieve the current user based on the token (set in authMiddleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return only wishlists where userEmail matches the current user's email
    const wishlists = await Wishlist.findAll({
      where: { userEmail: user.email },
    });
    res.json(wishlists);
  } catch (error) {
    console.error('[wishlistController] Error fetching wishlists:', error);
    res.status(500).json({ message: 'Error fetching wishlists' });
  }
};

// Get a single wishlist by id
const getWishlistById = async (req, res) => {
  const { id } = req.params;
  try {
    const wishlist = await Wishlist.findByPk(id);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    res.json(wishlist);
  } catch (error) {
    console.error('[wishlistController] Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Create a new wishlist using the token to determine the user's email
const createWishList = async (req, res) => {
  const { name } = req.body;
  try {
    // Retrieve the user from the token (req.user is set by authMiddleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Create the wishlist with the user's email and userId automatically
    const newWishlist = await Wishlist.create({
      name,
      userEmail: user.email,
      userId: user.id,
    });
    return res.status(201).json(newWishlist);
  } catch (error) {
    console.error('[createWishList] Error creating wishlist:', error);
    return res.status(500).json({ message: 'Error creating wishlist' });
  }
};

// Delete a wishlist
const deleteWishList = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Wishlist.destroy({ where: { id } });
    if (result === 0) {
      return res.status(404).send('Wishlist not found');
    }
    res.status(200).send('Wishlist deleted');
  } catch (error) {
    console.error('[deleteWishList] Error deleting wishlist:', error);
    res.status(500).send('Error deleting wishlist');
  }
};

module.exports = {
  getWishLists,
  getWishlistById,
  createWishList,
  deleteWishList,
};

// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');

// Get all wishlists for the logged-in user
const getWishLists = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Filter wishlists by the current user's email
    const wishlists = await Wishlist.findAll({ where: { userEmail: user.email } });
    res.json(wishlists);
  } catch (error) {
    console.error('[wishlistController] Error fetching wishlists:', error);
    res.status(500).json({ message: 'Error fetching wishlists' });
  }
};

// Get a single wishlist by id ensuring it belongs to the logged-in user
const getWishlistById = async (req, res) => {
  const { id } = req.params;
  try {
    const wishlist = await Wishlist.findOne({
      where: { id: id, userId: req.user.id },
    });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    res.json(wishlist);
  } catch (error) {
    console.error('[wishlistController] Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Create a new wishlist using the token to determine the user's email and id
const createWishList = async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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

// controllers/wishlistController.js
const deleteWishList = async (req, res) => {
  const { id } = req.params;
  console.log(`[deleteWishList] Attempting to delete wishlist with id=${id} for userId=${req.user.id}`);

  try {
    // Only destroy if the wishlist belongs to the logged-in user
    const result = await Wishlist.destroy({
      where: { id, userId: req.user.id },
    });

    // If no row was deleted, return 404
    if (result === 0) {
      console.error(`[deleteWishList] No wishlist found (or not owned) for id=${id}, userId=${req.user.id}`);
      return res.status(404).send('Wishlist not found');
    }

    console.log(`[deleteWishList] Wishlist with id=${id} was successfully deleted.`);
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

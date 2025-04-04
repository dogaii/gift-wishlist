const express = require('express');
const {
  getWishLists,
  getWishlistById, // added for getting a specific wishlist
  createWishList,
  deleteWishList,
} = require('../controllers/wishlistController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWishLists);
router.get('/:id', protect, getWishlistById); // new route for clicking a specific wishlist
router.post('/', protect, createWishList);
router.delete('/:id', protect, deleteWishList);

module.exports = router;

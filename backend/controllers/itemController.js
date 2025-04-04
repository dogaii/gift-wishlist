// controllers/itemController.js
const Item = require('../models/Item');
const Wishlist = require('../models/Wishlist');

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};

// Create a new item
const createItem = async (req, res) => {
  const { name, link, wishlistId } = req.body;
  try {
    // Check if the wishlist exists
    const wishlist = await Wishlist.findByPk(wishlistId);
    if (!wishlist) {
      return res.status(404).send('Wishlist not found');
    }
    // Create the item with the provided name and link
    const newItem = await Item.create({
      name,
      link,
      wishlistId,
      isPurchased: false,
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send('Error creating item');
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Item.destroy({ where: { id } });
    if (result === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
};

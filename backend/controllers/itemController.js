// controllers/itemController.js
const Item = require('../models/Item');
const Wishlist = require('../models/Wishlist');

// Get all items for the logged-in user by joining with Wishlist
const getItems = async (req, res) => {
  try {
    // Only return items whose associated wishlist belongs to the logged-in user
    const items = await Item.findAll({
      include: [{
        model: Wishlist,
        as: 'wishlistItem',
        where: { userId: req.user.id },
        attributes: [] // We don't need wishlist details here
      }]
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
};

// Create a new item only if the wishlist exists and belongs to the current user
const createItem = async (req, res) => {
  const { name, link, wishlistId } = req.body;
  try {
    // Verify that the wishlist exists and belongs to the logged-in user
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, userId: req.user.id },
    });
    if (!wishlist) return res.status(404).send('Wishlist not found');

    // Create the item with default isPurchased set to false
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

// Delete an item only if it belongs to a wishlist owned by the logged-in user
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the item by primary key
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Verify that the item's wishlist belongs to the logged-in user
    const wishlist = await Wishlist.findOne({
      where: { id: item.wishlistId, userId: req.user.id },
    });
    if (!wishlist)
      return res.status(403).json({ message: 'Not authorized to delete this item' });

    await item.destroy();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
};
// controllers/itemController.js
const updateItem = async (req, res) => {
  const { id } = req.params;
  // Explicitly convert the incoming value to a boolean.
  let newStatus = req.body.isPurchased;
  if (typeof newStatus !== "boolean") {
    newStatus = newStatus === true || newStatus === "true" || newStatus === 1;
  }
  console.log(`[updateItem] Updating item ${id} to isPurchased:`, newStatus);

  try {
    // Find the item by its primary key
    const item = await Item.findByPk(id);
    if (!item) {
      console.error(`[updateItem] Item not found with id ${id}`);
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Verify that the wishlist that owns the item is owned by the logged-in user
    const wishlist = await Wishlist.findOne({
      where: { id: item.wishlistId, userId: req.user.id },
    });
    if (!wishlist) {
      console.error(`[updateItem] Wishlist not found or unauthorized for item ${id}`);
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    // Update the isPurchased field
    const updatedItem = await item.update({ isPurchased: newStatus });
    console.log(`[updateItem] Item updated successfully:`, updatedItem);
    return res.json(updatedItem);
  } catch (error) {
    console.error('[updateItem] Error updating item:', error);
    return res.status(500).send('Error updating item');
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  updateItem,
};

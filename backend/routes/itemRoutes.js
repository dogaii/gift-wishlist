const express = require('express');
const {
  getItems,
  createItem,
  deleteItem,
} = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getItems); // Add protect here
router.post('/', protect, createItem); // Add protect here
router.delete('/:id', protect, deleteItem); // Add protect here

module.exports = router;

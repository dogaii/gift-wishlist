// routes/itemRoutes.js
const express = require('express');
const { getItems, createItem, deleteItem, updateItem } = require('../controllers/itemController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getItems);
router.post('/', protect, createItem);
router.put('/:id', protect, updateItem);  // New PUT route for updating purchase status
router.delete('/:id', protect, deleteItem);

module.exports = router;

// models/Item.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Item = sequelize.define('Item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false, // or true if the link is optional
  },
  isPurchased: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wishlistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Item;

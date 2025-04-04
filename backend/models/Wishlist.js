// models/Wishlist.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Wishlist = sequelize.define(
  'Wishlist',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: { // NEW FIELD
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shareLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Wishlist;

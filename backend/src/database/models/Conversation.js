const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  topic: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // in seconds
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, {
  tableName: 'conversations'
});

module.exports = Conversation;


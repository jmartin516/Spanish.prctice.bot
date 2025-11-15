const { DataTypes } = require('sequelize');
const { sequelize } = require('../config');

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  level: {
    type: DataTypes.ENUM('info', 'warning', 'error', 'debug', 'http'),
    allowNull: false,
    defaultValue: 'info'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  method: {
    type: DataTypes.STRING(10), // GET, POST, PUT, DELETE, etc.
    allowNull: true
  },
  path: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  statusCode: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_code'
  },
  responseTime: {
    type: DataTypes.INTEGER, // en milisegundos
    allowNull: true,
    field: 'response_time'
  },
  ip: {
    type: DataTypes.STRING(45), // IPv6 compatible
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'user_agent'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  error: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stack: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true // Para datos adicionales como body, query params, etc.
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  }
}, {
  tableName: 'logs',
  timestamps: true,
  updatedAt: false, // Los logs no se actualizan
  indexes: [
    { fields: ['level'] },
    { fields: ['created_at'] },
    { fields: ['user_id'] },
    { fields: ['status_code'] },
    { fields: ['path'] }
  ]
});

module.exports = Log;


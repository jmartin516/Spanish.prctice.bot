const { sequelize } = require('../config');
const User = require('./User');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Log = require('./Log');

// Define associations
User.hasMany(Conversation, { foreignKey: 'user_id', as: 'conversations' });
Conversation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

// Log associations (opcional - para relacionar logs con usuarios)
User.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Conversation,
  Message,
  Log
};


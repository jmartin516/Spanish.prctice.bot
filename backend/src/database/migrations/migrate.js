const { sequelize } = require('../config');
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Sync all models (creates tables if they don't exist)
    await sequelize.sync({ alter: false, force: false });
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created/verified: users, conversations, messages, logs');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;


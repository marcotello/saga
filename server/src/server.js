require('dotenv').config();
const app = require('./app');
const dataStore = require('./data/store');

/**
 * Server startup
 */

const PORT = process.env.PORT || 3000;

// Wait for data store to initialize before starting server
async function startServer() {
  try {
    // Wait for data store initialization (password hashing)
    await dataStore.initializeData();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Login API: http://localhost:${PORT}/api/auth/login`);
      console.log('=================================');
      console.log('\nAvailable test credentials:');
      console.log('Admin: johnsmith@saga.com / Password@123');
      console.log('User: jamesldixon@dayrep.com / meive4Lei');
      console.log('=================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();


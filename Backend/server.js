require ('dotenv').config();
const app = require('./src/app.js');
const connectDB = require('./src/config/database.js');
const { connectRedis } = require('./src/config/redis.js');


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ MongoDB connected');

    // Connect to Redis
    await connectRedis();
    console.log('✓ Redis connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

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

    // FIX Bug #6: Redis has zero consumers in the codebase. If it's
    // unreachable, warn and continue — don't crash the whole API server.
    try {
      await connectRedis();
      console.log('✓ Redis connected');
    } catch (redisErr) {
      console.warn('⚠ Redis connection failed — server will run without caching:', redisErr.message);
    }

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

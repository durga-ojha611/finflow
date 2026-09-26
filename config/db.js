import mongoose from 'mongoose';

let mongoMemoryServer = null;

/**
 * Connect to MongoDB database.
 * If MONGODB_URI is provided in environment variables, connects to external MongoDB (e.g. MongoDB Atlas).
 * If MONGODB_URI is empty or absent, initializes an in-memory MongoMemoryServer instance
 * for zero-setup local execution and testing.
 */
export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('⚡ No MONGODB_URI provided. Initializing in-memory MongoDB server for instant local dev...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      console.log(`✅ In-memory MongoDB running at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`📦 MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);

    // Graceful disconnect on process termination
    process.on('SIGINT', async () => {
      await disconnectDB();
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // If external URI failed, attempt memory fallback
    if (process.env.MONGODB_URI && !mongoMemoryServer) {
      console.log('⚠️ External MongoDB failed. Falling back to local in-memory MongoDB...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const fallbackUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`✅ Fallback In-memory MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`❌ Fallback in-memory MongoDB also failed: ${fallbackError.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

/**
 * Disconnect and clean up MongoDB connections
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('🔌 MongoDB disconnected successfully.');
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

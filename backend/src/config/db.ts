import mongoose from 'mongoose';

/**
 * Retrieves the MongoDB URI based on environment variables.
 */
const getDatabaseUri = (): string => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[database]: FATAL ERROR: MONGO_URI environment variable is not defined.');
    process.exit(1);
  }
  return uri;
};

/**
 * Provides environment-specific Mongoose connection options,
 * including connection pooling settings optimized for production vs dev.
 */
const getMongooseOptions = (): mongoose.ConnectOptions => {
  const env = process.env.NODE_ENV || 'development';

  return {
    // Connection pooling
    maxPoolSize: env === 'production' ? 100 : 10,
    minPoolSize: env === 'production' ? 10 : 2,
    
    // Timeouts
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    
    // Network
    family: 4, // Use IPv4, skip trying IPv6
  };
};

/**
 * Initializes the MongoDB connection and sets up core event listeners.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const uri = getDatabaseUri();
    const options = getMongooseOptions();
    
    // Set up MongoDB connection event listeners to monitor database health
    mongoose.connection.on('connected', () => {
      const dbName = mongoose.connection.name;
      console.log(`[database]: Successfully connected to database: "${dbName}"`);
    });

    mongoose.connection.on('error', (err) => {
      console.error('[database]: MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[database]: MongoDB disconnected from the server');
    });

    // Attempt initial connection
    const conn = await mongoose.connect(uri, options);
    console.log(`[database]: Mongoose connection established with host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[database]: Failed to establish initial MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Handles graceful shutdown by cleanly closing the MongoDB connection
 * when the Node.js process receives termination signals.
 */
export const handleGracefulShutdown = (): void => {
  const gracefulExit = async (signal: string) => {
    console.log(`\n[server]: Received signal ${signal}. Closing database connection...`);
    try {
      await mongoose.connection.close(false); // pass false to skip forcing closure
      console.log('[database]: MongoDB connection closed gracefully.');
      process.exit(0);
    } catch (err) {
      console.error('[database]: Error closing MongoDB connection during shutdown:', err);
      process.exit(1);
    }
  };

  // Node.js process exit signals
  process.on('SIGINT', () => gracefulExit('SIGINT'));   // Ctrl+C
  process.on('SIGTERM', () => gracefulExit('SIGTERM')); // Docker stop, Heroku, etc.

  // Handle Nodemon restarts strictly
  process.once('SIGUSR2', async () => {
    await mongoose.connection.close(false);
    process.kill(process.pid, 'SIGUSR2');
  });
};

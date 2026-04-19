import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
/**
 * Retrieves the MongoDB URI based on environment variables.
 */
const getDatabaseUri = () => {
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
const getMongooseOptions = () => {
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
export const connectDB = async () => {
    const options = getMongooseOptions();
    const uri = getDatabaseUri();
    // Set up MongoDB connection event listeners
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
    try {
        // Attempt initial connection to Atlas/specified URI
        console.log(`[database]: Attempting to connect to MongoDB...`);
        const conn = await mongoose.connect(uri, options);
        console.log(`[database]: Mongoose connection established with host: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[database]: Failed to connect to primary MongoDB: ${error.message}`);
        // Fallback to MongoMemoryServer for development if Atlas connection fails
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[database]: Falling back to MongoMemoryServer for local development...');
            try {
                const mongoServer = await MongoMemoryServer.create();
                const memoryUri = mongoServer.getUri();
                const conn = await mongoose.connect(memoryUri, options);
                console.log(`[database]: Mongoose connected to Memory Server: ${conn.connection.host}`);
            }
            catch (fallbackError) {
                console.error(`[database]: Critical failure - Fallback to Memory Server also failed: ${fallbackError.message}`);
                process.exit(1);
            }
        }
        else {
            process.exit(1);
        }
    }
};
/**
 * Handles graceful shutdown by cleanly closing the MongoDB connection
 * when the Node.js process receives termination signals.
 */
export const handleGracefulShutdown = () => {
    const gracefulExit = async (signal) => {
        console.log(`\n[server]: Received signal ${signal}. Closing database connection...`);
        try {
            await mongoose.connection.close(false); // pass false to skip forcing closure
            console.log('[database]: MongoDB connection closed gracefully.');
            process.exit(0);
        }
        catch (err) {
            console.error('[database]: Error closing MongoDB connection during shutdown:', err);
            process.exit(1);
        }
    };
    // Node.js process exit signals
    process.on('SIGINT', () => gracefulExit('SIGINT')); // Ctrl+C
    process.on('SIGTERM', () => gracefulExit('SIGTERM')); // Docker stop, Heroku, etc.
    // Handle Nodemon restarts strictly
    process.once('SIGUSR2', async () => {
        await mongoose.connection.close(false);
        process.kill(process.pid, 'SIGUSR2');
    });
};

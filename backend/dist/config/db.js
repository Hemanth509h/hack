"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGracefulShutdown = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
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
const connectDB = async () => {
    const options = getMongooseOptions();
    const uri = getDatabaseUri();
    // Set up MongoDB connection event listeners
    mongoose_1.default.connection.on('connected', () => {
        const dbName = mongoose_1.default.connection.name;
        console.log(`[database]: Successfully connected to database: "${dbName}"`);
    });
    mongoose_1.default.connection.on('error', (err) => {
        console.error('[database]: MongoDB connection error:', err);
    });
    mongoose_1.default.connection.on('disconnected', () => {
        console.warn('[database]: MongoDB disconnected from the server');
    });
    try {
        // Attempt initial connection to Atlas/specified URI
        console.log(`[database]: Attempting to connect to MongoDB...`);
        const conn = await mongoose_1.default.connect(uri, options);
        console.log(`[database]: Mongoose connection established with host: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[database]: Failed to connect to primary MongoDB: ${error.message}`);
        // Fallback to MongoMemoryServer for development if Atlas connection fails
        if (process.env.NODE_ENV !== 'production') {
            console.warn('[database]: Falling back to MongoMemoryServer for local development...');
            try {
                const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
                const memoryUri = mongoServer.getUri();
                const conn = await mongoose_1.default.connect(memoryUri, options);
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
exports.connectDB = connectDB;
/**
 * Handles graceful shutdown by cleanly closing the MongoDB connection
 * when the Node.js process receives termination signals.
 */
const handleGracefulShutdown = () => {
    const gracefulExit = async (signal) => {
        console.log(`\n[server]: Received signal ${signal}. Closing database connection...`);
        try {
            await mongoose_1.default.connection.close(false); // pass false to skip forcing closure
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
        await mongoose_1.default.connection.close(false);
        process.kill(process.pid, 'SIGUSR2');
    });
};
exports.handleGracefulShutdown = handleGracefulShutdown;

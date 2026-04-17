import app from './app';
import dotenv from 'dotenv';
import http from 'http';
import { connectDB, handleGracefulShutdown } from './config/db';
import { connectRedis, isRedisConnected } from './config/redis';
import { initializeSocket } from './config/socket';

import { initializeQueues } from './config/queue';
import { startNotificationWorker } from './workers/notification.worker';

dotenv.config();

const port = process.env.PORT || 5000;

// Wrap express in native HTTP server so Socket.io can attach
const httpServer = http.createServer(app);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Initialize Socket.io with Redis adapter (async — must await)
    // Refactored to handle its own fallback internaly
    await initializeSocket(httpServer);



    // Only set up BullMQ if Redis is available
    if (isRedisConnected()) {
      initializeQueues();
      startNotificationWorker();
    }

    // Register graceful shutdown for process interruption signals
    handleGracefulShutdown();

    httpServer.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

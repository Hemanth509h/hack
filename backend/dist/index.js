"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const db_1 = require("./config/db");
const redis_1 = require("./config/redis");
const socket_1 = require("./config/socket");
const queue_1 = require("./config/queue");
const notification_worker_1 = require("./workers/notification.worker");
const port = process.env.PORT || 5000;
// Wrap express in native HTTP server so Socket.io can attach
const httpServer = http_1.default.createServer(app_1.default);
// Connect to Database and start server
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, redis_1.connectRedis)();
        // Initialize Socket.io with Redis adapter (async — must await)
        // Refactored to handle its own fallback internaly
        await (0, socket_1.initializeSocket)(httpServer);
        // Only set up BullMQ if Redis is available
        if ((0, redis_1.isRedisConnected)()) {
            (0, queue_1.initializeQueues)();
            (0, notification_worker_1.startNotificationWorker)();
        }
        // Register graceful shutdown for process interruption signals
        (0, db_1.handleGracefulShutdown)();
        httpServer.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();

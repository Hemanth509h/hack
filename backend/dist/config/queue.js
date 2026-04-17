"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = exports.getNotificationQueue = exports.initializeQueues = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
// BullMQ re-uses the same Redis connection settings
// Helper to parse Redis URI into BullMQ connection options
const getRedisConnection = () => {
    const uri = process.env.REDIS_URI || 'redis://localhost:6379';
    try {
        const parsed = new URL(uri);
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port) || 6379,
            username: parsed.username || undefined,
            password: parsed.password || undefined,
            // Some Redis Cloud providers require TLS
            tls: uri.startsWith('rediss://') ? {} : undefined,
        };
    }
    catch (err) {
        console.warn('[queue]: Invalid REDIS_URI, falling back to default localhost');
        return { host: 'localhost', port: 6379 };
    }
};
const redisConnection = getRedisConnection();
exports.redisConnection = redisConnection;
let notificationQueue = null;
let notificationQueueEvents = null;
/**
 * Initialize BullMQ queues and events only if Redis is available.
 */
const initializeQueues = () => {
    if (!(0, redis_1.isRedisConnected)()) {
        console.warn('[queue]: Redis not connected. BullMQ queues will not be initialized.');
        return;
    }
    try {
        notificationQueue = new bullmq_1.Queue('notifications', {
            connection: redisConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnComplete: 100,
                removeOnFail: 50,
            },
        });
        notificationQueueEvents = new bullmq_1.QueueEvents('notifications', {
            connection: redisConnection,
        });
        notificationQueueEvents.on('failed', ({ jobId, failedReason }) => {
            console.error(`[queue]: Notification job ${jobId} failed — ${failedReason}`);
        });
        notificationQueueEvents.on('completed', ({ jobId }) => {
            console.log(`[queue]: Notification job ${jobId} delivered`);
        });
        console.log('[queue]: BullMQ queues initialized');
    }
    catch (err) {
        console.error('[queue]: Failed to initialize BullMQ:', err);
    }
};
exports.initializeQueues = initializeQueues;
const getNotificationQueue = () => notificationQueue;
exports.getNotificationQueue = getNotificationQueue;

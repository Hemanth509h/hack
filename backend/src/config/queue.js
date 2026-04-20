import { Queue, QueueEvents } from 'bullmq';
import { isRedisConnected } from './redis.js';
const CLOUD_REDIS_FALLBACK = 'redis://default:Rm4WMUgpWGvACeyz5VbWrLGlBCHJJVVY@redis-10735.crce182.ap-south-1-1.ec2.cloud.redislabs.com:10735';

// BullMQ re-uses the same Redis connection settings
// Helper to parse Redis URI into BullMQ connection options
const getRedisConnection = () => {
    const uri = process.env.REDIS_URI || CLOUD_REDIS_FALLBACK;
    try {
        const parsed = new URL(uri);
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port) || 6379,
            username: parsed.username || undefined,
            password: parsed.password || undefined,
            // Some Redis Cloud providers require TLS
            tls: uri.startsWith('rediss://') ? {} : undefined,
            // Suppress "IMPORTANT! Eviction policy is volatile-lru. It should be "noeviction"" warning
            // This is necessary for managed Redis instances like Redis Cloud where CONFIG SET is restricted.
            skipVersionCheck: true,
            maxRetriesPerRequest: null // Required by BullMQ when using ioredis
        };
    }
    catch (err) {
        console.warn('[queue]: Invalid REDIS_URI, falling back to default cloud');
        const parsed = new URL(CLOUD_REDIS_FALLBACK);
        return { 
            host: parsed.hostname, 
            port: parseInt(parsed.port),
            username: parsed.username,
            password: parsed.password,
            skipVersionCheck: true,
            maxRetriesPerRequest: null
        };
    }
};

let redisConnection = null;
const getOrCreateConnection = () => {
    if (!redisConnection) {
        redisConnection = getRedisConnection();
    }
    return redisConnection;
};
let notificationQueue = null;
let notificationQueueEvents = null;
/**
 * Initialize BullMQ queues and events only if Redis is available.
 */
export const initializeQueues = () => {
    if (!isRedisConnected()) {
        console.warn('[queue]: Redis not connected. BullMQ queues will not be initialized.');
        return;
    }
    try {
        notificationQueue = new Queue('notifications', {
            connection: getOrCreateConnection(),
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnComplete: 100,
                removeOnFail: 50,
            },
        });
        notificationQueueEvents = new QueueEvents('notifications', {
            connection: getOrCreateConnection(),
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
export const getNotificationQueue = () => notificationQueue;
export const getRedisConnectionConfig = () => getOrCreateConnection();
export { getOrCreateConnection as redisConnection };

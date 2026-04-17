"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisConnected = exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URI || 'redis://default:Rm4WMUgpWGvACeyz5VbWrLGlBCHJJVVY@redis-10735.crce182.ap-south-1-1.ec2.cloud.redislabs.com:10735';
exports.redisClient = (0, redis_1.createClient)({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                // Stop retrying after 5 attempts to prevent log spam in dev
                // Returning 'false' would cause a fatal error; returning an Error object or stopping here is tricky.
                // We handle this by checking connectivity in the start script.
                return false;
            }
            return Math.min(retries * 100, 3000);
        }
    }
});
let isConnected = false;
exports.redisClient.on('error', (err) => {
    if (err.code === 'ECONNREFUSED') {
        isConnected = false;
    }
    else {
        console.error('[redis]: Redis Client Error:', err.message);
    }
});
exports.redisClient.on('connect', () => {
    isConnected = true;
    console.log('[redis]: Successfully connected');
});
const connectRedis = async () => {
    try {
        // Only attempt connection if not already connecting/connected
        if (!exports.redisClient.isOpen) {
            await exports.redisClient.connect();
        }
        return true;
    }
    catch (error) {
        console.warn('[redis]: Connection failed. Local fallback mode enabled.');
        isConnected = false;
        return false;
    }
};
exports.connectRedis = connectRedis;
const isRedisConnected = () => isConnected;
exports.isRedisConnected = isRedisConnected;

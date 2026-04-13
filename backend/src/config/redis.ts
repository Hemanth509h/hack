import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URI || 'redis://localhost:6379';

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('[redis]: Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('[redis]: Successfully connected');
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    console.error('[redis]: Connection error:', error.message);
  }
};

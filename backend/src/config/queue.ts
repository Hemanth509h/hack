import { Queue, Worker, QueueEvents } from 'bullmq';

// BullMQ re-uses the same Redis connection settings
const redisConnection = {
  host: (process.env.REDIS_URI || 'redis://localhost:6379').replace('redis://', '').split(':')[0],
  port: parseInt((process.env.REDIS_URI || 'redis://localhost:6379').split(':')[2] || '6379'),
};

// Single notification queue — workers consume from this
export const notificationQueue = new Queue('notifications', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry failed deliveries up to 3 times
    backoff: { type: 'exponential', delay: 5000 }, // 5s, 10s, 20s backoff
    removeOnComplete: 100, // Keep last 100 completed jobs for debugging
    removeOnFail: 50,
  },
});

export const notificationQueueEvents = new QueueEvents('notifications', {
  connection: redisConnection,
});

notificationQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`[queue]: Notification job ${jobId} failed — ${failedReason}`);
});

notificationQueueEvents.on('completed', ({ jobId }) => {
  console.log(`[queue]: Notification job ${jobId} delivered`);
});

export { redisConnection };

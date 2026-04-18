import { Worker } from 'bullmq';
import { redisConnection } from '../config/queue';
import { processNotificationJob, NotificationPayload } from '../services/notification.service';

/**
 * BullMQ Worker — consumes jobs from the 'notifications' queue.
 * Runs in the same process as the server for simplicity.
 * In production, this could be extracted to a separate worker process.
 */
export const startNotificationWorker = () => {
  const worker = new Worker(
    'notifications',
    async (job) => {
      console.log(`[worker]: Processing notification job ${job.id} (type: ${job.data.type})`);
      await processNotificationJob(job.data);
    },
    {
      connection: redisConnection,
      concurrency: 10, // Process up to 10 notification jobs concurrently
    }
  );

  worker.on('completed', (job) => {
    console.log(`[worker]: Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, error) => {
    console.error(`[worker]: Job ${job?.id} failed: ${error.message}`);
  });

  worker.on('error', (error) => {
    console.error('[worker]: Worker encountered an error:', error);
  });

  console.log('[worker]: Notification worker started');
  return worker;
};

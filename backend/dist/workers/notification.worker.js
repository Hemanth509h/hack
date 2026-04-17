"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNotificationWorker = void 0;
const bullmq_1 = require("bullmq");
const queue_1 = require("../config/queue");
const notification_service_1 = require("../services/notification.service");
/**
 * BullMQ Worker — consumes jobs from the 'notifications' queue.
 * Runs in the same process as the server for simplicity.
 * In production, this could be extracted to a separate worker process.
 */
const startNotificationWorker = () => {
    const worker = new bullmq_1.Worker('notifications', async (job) => {
        console.log(`[worker]: Processing notification job ${job.id} (type: ${job.data.type})`);
        await (0, notification_service_1.processNotificationJob)(job.data);
    }, {
        connection: queue_1.redisConnection,
        concurrency: 10, // Process up to 10 notification jobs concurrently
    });
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
exports.startNotificationWorker = startNotificationWorker;

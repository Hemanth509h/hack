import Handlebars from 'handlebars';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { getNotificationQueue } from '../config/queue';
import { sendEmail } from '../utils/email.utils';
import { emitToUser } from '../config/socket';

import { renderEmailHtml } from './email-renderer.service';
import mongoose from 'mongoose';

/** ----------------------------------------------------------------
 *  EMAIL TEMPLATES (Handlebars inline — no file I/O needed)
 * ---------------------------------------------------------------- */
const templateSource = {
  event_update: `
    <div style="font-family,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#818cf8;margin-bottom:8px">📅 Event Update</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Event</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b">You received this because you RSVP'd to this event. <a href="{{unsubscribeUrl}}" style="color:#818cf8">Unsubscribe</a></p>
    </div>`,

  club_announcement: `
    <div style="font-family,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#34d399;margin-bottom:8px">📣 Club Announcement</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#059669;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Club</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#34d399">Unsubscribe from club announcements</a></p>
    </div>`,

  team_request: `
    <div style="font-family,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#f59e0b;margin-bottom:8px">🤝 Team Request</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Review Request</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#f59e0b">Manage notification preferences</a></p>
    </div>`,

  default: `
    <div style="font-family,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#818cf8;margin-bottom:8px">🔔 The Quad</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#818cf8">Manage preferences</a></p>
    </div>`,
};

const compileTemplate = (type, data) => {
  const source = templateSource[type] ?? templateSource['default'];
  return Handlebars.compile(source)(data);
};

/** ----------------------------------------------------------------
 *  NOTIFICATION PAYLOAD INTERFACE
 * ---------------------------------------------------------------- */
export 

/** ----------------------------------------------------------------
 *  CORE SEND — creates DB record + enqueues delivery job
 * ---------------------------------------------------------------- */
export const sendNotification = async (payload) => {
  // 1. Persist to MongoDB (in-app display)
  await Notification.create({
    recipient: new mongoose.Types.ObjectId(payload.recipientId),
    type: payload.type,
    title: payload.title,
    message: payload.message,
    dataPayload: payload.dataPayload,
  });

  // 2. Push delivery job to BullMQ queue (async processing)
  const queue = getNotificationQueue();
  if (queue) {
    await queue.add('deliver', payload, {
      jobId: `notify-${payload.recipientId}-${Date.now()}`,
    });
  }
};

/** ----------------------------------------------------------------
 *  BULK SEND — fan-out to multiple recipients efficiently
 * ---------------------------------------------------------------- */
export const sendBulkNotifications = async (
  recipientIds: string[],
  base
) => {
  const notifications = recipientIds.map((id) => ({
    recipient: new mongoose.Types.ObjectId(id),
    type: base.type,
    title: base.title,
    message: base.message,
    dataPayload: base.dataPayload,
  }));

  // Bulk insert to MongoDB
  await Notification.insertMany(notifications);

  // Enqueue one job per recipient for multi-channel delivery
  const queue = getNotificationQueue();
  if (queue) {
    const jobs = recipientIds.map((id) => ({
      name: 'deliver',
      data: { ...base, recipientId: id },
    }));
    await queue.addBulk(jobs);
  }
};

/** ----------------------------------------------------------------
 *  DELIVERY PROCESSOR — called by BullMQ Worker
 *  Handles all channels: Socket.io, Email, Push
 * ---------------------------------------------------------------- */
export const processNotificationJob = async (payload) => {
  const user = await User.findById(payload.recipientId).lean();
  if (!user) return;

  const prefs = (user as any).notificationPreferences ?? { inApp: true, email: true, push: true };

  // Channel 1: In-App (Socket.io) — always attempt real-time delivery
  if (prefs.inApp) {
    const unreadCount = await Notification.countDocuments({ 
      recipient: new mongoose.Types.ObjectId(payload.recipientId), 
      isRead: false 
    });
    
    emitToUser(payload.recipientId, 'notification:new', {
      type: payload.type,
      title: payload.title,
      message: payload.message,
      dataPayload: payload.dataPayload,
      unreadCount,
      createdAt: new Date(),
    });
  }

  // Channel 2
  if (prefs.email && (user as any).email) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL}/settings/notifications`;
    
    // Attempt file-based juice-inlined templates. If it fails or template doesn't exist, fallback to raw DB text.
    let html = renderEmailHtml(payload.type, {
      title: payload.title,
      message: payload.message,
      ctaUrl: payload.ctaUrl,
      name: (user as any).name || 'Student',
      unsubscribeUrl,
      ...(payload.dataPayload ?? {})
    });

    if (!html) {
      html = compileTemplate(payload.type, {
        title: payload.title,
        message: payload.message,
        ctaUrl: payload.ctaUrl,
        unsubscribeUrl,
      });
    }

    await sendEmail({
      to: (user as any).email,
      subject: payload.title,
      text: payload.message,
      html,
    });
  }

  // Channel 3: Push Notifications (WebPushr)
  if (prefs.push && (user as any).email) {
    await sendPushNotification({
      email: (user as any).email,
      title: payload.title,
      message: payload.message,
      url: payload.ctaUrl || process.env.FRONTEND_URL
    });
  }
};

/**
 * @desc    Send WebPushr Notification via REST API
 */
const sendPushNotification = async (data: { email; title; message; url?: string }) => {
  const WEBPUSHR_KEY = process.env.WEBPUSHR_KEY;
  const WEBPUSHR_AUTH = process.env.WEBPUSHR_AUTH;

  if (!WEBPUSHR_KEY || !WEBPUSHR_AUTH) {
    console.log('WebPushr credentials missing, skipping push notification');
    return;
  }

  try {
    // In a real implementation, we'd use axios or fetch to hit https://api.webpushr.com/v1/notification/send/sid
    // For now, we'll log the attempt
    console.log(`[WebPushr] Sending push to ${data.email}: ${data.title}`);
  } catch (error) {
    console.error('WebPushr delivery failed:', error.message);
  }
};

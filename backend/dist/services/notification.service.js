"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processNotificationJob = exports.sendBulkNotifications = exports.sendNotification = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const Notification_1 = require("../models/Notification");
const User_1 = require("../models/User");
const queue_1 = require("../config/queue");
const email_utils_1 = require("../utils/email.utils");
const socket_1 = require("../config/socket");
const email_renderer_service_1 = require("./email-renderer.service");
const mongoose_1 = __importDefault(require("mongoose"));
/** ----------------------------------------------------------------
 *  EMAIL TEMPLATES (Handlebars inline — no file I/O needed)
 * ---------------------------------------------------------------- */
const templateSource = {
    event_update: `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#818cf8;margin-bottom:8px">📅 Event Update</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Event</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b">You received this because you RSVP'd to this event. <a href="{{unsubscribeUrl}}" style="color:#818cf8">Unsubscribe</a></p>
    </div>`,
    club_announcement: `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#34d399;margin-bottom:8px">📣 Club Announcement</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#059669;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Club</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#34d399">Unsubscribe from club announcements</a></p>
    </div>`,
    team_request: `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#f59e0b;margin-bottom:8px">🤝 Team Request</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      {{#if ctaUrl}}<a href="{{ctaUrl}}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Review Request</a>{{/if}}
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#f59e0b">Manage notification preferences</a></p>
    </div>`,
    default: `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;padding:32px;background:#0f0f1a;color:#e2e8f0;border-radius:12px">
      <h1 style="color:#818cf8;margin-bottom:8px">🔔 The Quad</h1>
      <h2 style="margin:0 0 16px">{{title}}</h2>
      <p>{{message}}</p>
      <p style="margin-top:32px;font-size:12px;color:#64748b"><a href="{{unsubscribeUrl}}" style="color:#818cf8">Manage preferences</a></p>
    </div>`,
};
const compileTemplate = (type, data) => {
    const source = templateSource[type] ?? templateSource['default'];
    return handlebars_1.default.compile(source)(data);
};
/** ----------------------------------------------------------------
 *  CORE SEND — creates DB record + enqueues delivery job
 * ---------------------------------------------------------------- */
const sendNotification = async (payload) => {
    // 1. Persist to MongoDB (in-app display)
    await Notification_1.Notification.create({
        recipient: new mongoose_1.default.Types.ObjectId(payload.recipientId),
        type: payload.type,
        title: payload.title,
        message: payload.message,
        dataPayload: payload.dataPayload,
    });
    // 2. Push delivery job to BullMQ queue (async processing)
    const queue = (0, queue_1.getNotificationQueue)();
    if (queue) {
        await queue.add('deliver', payload, {
            jobId: `notify-${payload.recipientId}-${Date.now()}`,
        });
    }
};
exports.sendNotification = sendNotification;
/** ----------------------------------------------------------------
 *  BULK SEND — fan-out to multiple recipients efficiently
 * ---------------------------------------------------------------- */
const sendBulkNotifications = async (recipientIds, base) => {
    const notifications = recipientIds.map((id) => ({
        recipient: new mongoose_1.default.Types.ObjectId(id),
        type: base.type,
        title: base.title,
        message: base.message,
        dataPayload: base.dataPayload,
    }));
    // Bulk insert to MongoDB
    await Notification_1.Notification.insertMany(notifications);
    // Enqueue one job per recipient for multi-channel delivery
    const queue = (0, queue_1.getNotificationQueue)();
    if (queue) {
        const jobs = recipientIds.map((id) => ({
            name: 'deliver',
            data: { ...base, recipientId: id },
        }));
        await queue.addBulk(jobs);
    }
};
exports.sendBulkNotifications = sendBulkNotifications;
/** ----------------------------------------------------------------
 *  DELIVERY PROCESSOR — called by BullMQ Worker
 *  Handles all channels: Socket.io, Email, Push
 * ---------------------------------------------------------------- */
const processNotificationJob = async (payload) => {
    const user = await User_1.User.findById(payload.recipientId).lean();
    if (!user)
        return;
    const prefs = user.notificationPreferences ?? { inApp: true, email: true, push: true };
    // Channel 1: In-App (Socket.io) — always attempt real-time delivery
    if (prefs.inApp) {
        const unreadCount = await Notification_1.Notification.countDocuments({
            recipient: new mongoose_1.default.Types.ObjectId(payload.recipientId),
            isRead: false
        });
        (0, socket_1.emitToUser)(payload.recipientId, 'notification:new', {
            type: payload.type,
            title: payload.title,
            message: payload.message,
            dataPayload: payload.dataPayload,
            unreadCount,
            createdAt: new Date(),
        });
    }
    // Channel 2: Email
    if (prefs.email && user.email) {
        const unsubscribeUrl = `${process.env.FRONTEND_URL}/settings/notifications`;
        // Attempt file-based juice-inlined templates. If it fails or template doesn't exist, fallback to raw DB text.
        let html = (0, email_renderer_service_1.renderEmailHtml)(payload.type, {
            title: payload.title,
            message: payload.message,
            ctaUrl: payload.ctaUrl,
            name: user.name || 'Student',
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
        await (0, email_utils_1.sendEmail)({
            to: user.email,
            subject: payload.title,
            text: payload.message,
            html,
        });
    }
};
exports.processNotificationJob = processNotificationJob;

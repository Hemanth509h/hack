import mongoose, { Schema, Document } from 'mongoose';

export 

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type, required: true },
  title: { type, required: true },
  message: { type, required: true },
  dataPayload: Schema.Types.Mixed,
  isRead: { type, default: false }
}, { timestamps: true });

// Optional: standard index for checking unread payload
NotificationSchema.index({ recipient: 1, isRead: 1 });

// TTL Index: automatically delete notification records after 30 days. (2592000 seconds)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Notification = mongoose.model('Notification', NotificationSchema);

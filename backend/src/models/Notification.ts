import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: string; // 'team_request', 'event_update', 'club_announcement'
  title: string;
  message: string;
  dataPayload?: any; // For deep linking IDs
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  dataPayload: Schema.Types.Mixed,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Optional: standard index for checking unread payload
NotificationSchema.index({ recipient: 1, isRead: 1 });

// TTL Index: automatically delete notification records after 30 days. (2592000 seconds)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

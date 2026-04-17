import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  user?: mongoose.Types.ObjectId;  // Optional for anonymous tracks
  anonymousId?: string; // High-entropy string persisted to local storage
  category: string; // 'event_discovery', 'club_join', etc
  action: string;
  label?: string; // Specific string like 'Hackathon XYZ'
  value?: number; // Numeric association like duration
  path: string; // React Router path
  metadata?: any;
  ipAddress?: string; // Store anonymously/hashed if strictly GDPR
  userAgent?: string;
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  anonymousId: { type: String, index: true },
  category: { type: String, required: true, index: true },
  action: { type: String, required: true },
  label: { type: String },
  value: { type: Number },
  path: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Drop massive logs after 2 Years (730 days) to prevent unconstrained scaling
AnalyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 730 * 24 * 60 * 60 });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

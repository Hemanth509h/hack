import mongoose, { Schema, Document } from 'mongoose';

export 

const AnalyticsEventSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  anonymousId: { type, index: true },
  category: { type, required: true, index: true },
  action: { type, required: true },
  label: { type: String },
  value: { type: Number },
  path: { type, required: true },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type, default: Date.now }
});

// Drop massive logs after 2 Years (730 days) to prevent unconstrained scaling
AnalyticsEventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 730 * 24 * 60 * 60 });

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', AnalyticsEventSchema);

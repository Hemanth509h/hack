import mongoose, { Schema } from "mongoose";

const AnalyticsEventSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", index: true },
  anonymousId: { type: String, index: true },
  category: { type: String, required: true, index: true },
  action: { type: String, required: true },
  label: { type: String },
  value: { type: Number },
  path: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// Drop massive logs after 2 Years (730 days) to prevent unconstrained scaling
AnalyticsEventSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 730 * 24 * 60 * 60 },
);

export const AnalyticsEvent = mongoose.model(
  "AnalyticsEvent",
  AnalyticsEventSchema,
);

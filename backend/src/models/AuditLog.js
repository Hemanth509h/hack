import mongoose, { Schema, Document } from 'mongoose';

export 

const AuditLogSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type, required: true, index: true },
  resource: { type, required: true, index: true },
  resourceId: { type: Schema.Types.ObjectId },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type, default: Date.now }
}, { timestamps: true });

// TTL Index for auto-cleanup (Default: 90 days)
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

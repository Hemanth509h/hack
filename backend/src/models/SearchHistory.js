import mongoose, { Schema, Document } from 'mongoose';

export 

const SearchHistorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  query: { type, required: true, trim: true },
  type: { type, enum: ['event', 'club', 'all'], default: 'all' },
  timestamp: { type, default: Date.now }
}, { timestamps: true });

// Index for auto-cleanup (TTL index) - keep history for 30 days
SearchHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);

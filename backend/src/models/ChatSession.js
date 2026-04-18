import mongoose, { Schema, Document } from 'mongoose';

export 

export 

const ChatSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  messages: [{
    role: { type, enum: ['system', 'user', 'assistant', 'tool'], required: true },
    content: { type, required: false },
    name,
    tool_call_id,
    tool_calls: Schema.Types.Mixed
  }],
  lastInteraction: { type, default: Date.now }
}, { timestamps: true });

// Optional: Expire idle sessions after 7 days
ChatSessionSchema.index({ lastInteraction: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

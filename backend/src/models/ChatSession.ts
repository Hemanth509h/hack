import mongoose, { Schema, Document } from 'mongoose';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string; // used for tool names
  tool_call_id?: string; // used for tool responses
  tool_calls?: any[]; // used when assistant calls tools
}

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId;
  messages: ChatMessage[];
  lastInteraction: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  messages: [{
    role: { type: String, enum: ['system', 'user', 'assistant', 'tool'], required: true },
    content: { type: String, required: false },
    name: String,
    tool_call_id: String,
    tool_calls: Schema.Types.Mixed
  }],
  lastInteraction: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Optional: Expire idle sessions after 7 days
ChatSessionSchema.index({ lastInteraction: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export const ChatSession = mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

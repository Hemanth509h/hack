import mongoose, { Schema, Document } from 'mongoose';

export 

export 

const MessageSchema = new Schema({
  roomType: { type, enum: ['event', 'club', 'project', 'direct'], required: true },
  roomId: { type: Schema.Types.ObjectId, required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type, required: true, trim: true, maxlength: 2000 },
  type: { type, enum: ['text', 'announcement'], default: 'text' },
}, { timestamps: true });

// Compound index for fetching message history per room efficiently
MessageSchema.index({ roomType: 1, roomId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', MessageSchema);

import mongoose, { Schema, Document } from 'mongoose';

export type MessageRoomType = 'event' | 'club' | 'project';

export interface IMessage extends Document {
  roomType: MessageRoomType;
  roomId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'announcement'; // announcements are system-level, text is user-sent
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  roomType: { type: String, enum: ['event', 'club', 'project'], required: true },
  roomId: { type: Schema.Types.ObjectId, required: true, index: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  type: { type: String, enum: ['text', 'announcement'], default: 'text' },
}, { timestamps: true });

// Compound index for fetching message history per room efficiently
MessageSchema.index({ roomType: 1, roomId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);

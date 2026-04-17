import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

// Ensure participants are unique and sorted for indexing
ConversationSchema.index({ participants: 1 });

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);

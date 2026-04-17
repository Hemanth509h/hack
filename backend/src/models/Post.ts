import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  attachments?: string[];
  likes: mongoose.Types.ObjectId[];
  comments: {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  category: 'general' | 'club_update' | 'event_hype' | 'academic';
  clubContext?: mongoose.Types.ObjectId; // If post is made on behalf of a club
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  attachments: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  category: { 
    type: String, 
    enum: ['general', 'club_update', 'event_hype', 'academic'], 
    default: 'general' 
  },
  clubContext: { type: Schema.Types.ObjectId, ref: 'Club' }
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', PostSchema);

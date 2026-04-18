import mongoose, { Schema, Document } from 'mongoose';

export [];
  category: 'general' | 'club_update' | 'event_hype' | 'academic';
  clubContext?: mongoose.Types.ObjectId; // If post is made on behalf of a club
  createdAt;
  updatedAt;
}

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type, required: true, maxlength: 2000 },
  attachments: [{ type: String }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type, required: true },
    createdAt: { type, default: Date.now }
  }],
  category: { 
    type, 
    enum: ['general', 'club_update', 'event_hype', 'academic'], 
    default: 'general' 
  },
  clubContext: { type: Schema.Types.ObjectId, ref: 'Club' }
}, { timestamps: true });

export const Post = mongoose.model('Post', PostSchema);

import mongoose, { Schema, Document } from 'mongoose';

export ;
  meetingSchedule?;
  tags: string[];
  memberCount; // Denormalized counter
  createdAt;
  updatedAt;
}

const ClubSchema = new Schema({
  name: { type, required: true, unique: true, trim: true },
  description: { type, required: true },
  category: { type, required: true, index: true },
  logo,
  coverImage,
  status: { type, enum: ['pending', 'active', 'inactive'], default: 'pending', index: true },
  socialLinks: {
    website,
    instagram,
    discord
  },
  meetingSchedule,
  tags: [{ type, trim: true, lowercase: true }],
  memberCount: { type, default: 0 }
}, { timestamps: true });

// Text index to support full-text discovery
ClubSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Club = mongoose.model('Club', ClubSchema);

import mongoose, { Schema, Document } from 'mongoose';

export ;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt;
  updatedAt;
}

const EventSchema = new Schema({
  title: { type, required: true, trim: true },
  description: { type, required: true },
  category: { type, required: true, index: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club', index: true },
  location: { type: Schema.Types.ObjectId, ref: 'Location' },
  locationDetails,
  date: { type, required: true },
  durationMinutes: { type, default: 60 },
  capacity,
  rsvpCount: { type, default: 0 },
  coverImage,
  tags: [{ type, trim: true, lowercase: true }],
  targetAudience: {
    majors: [String],
    years: [Number]
  },
  status: { type, enum: ['draft', 'published', 'cancelled', 'completed'], default: 'published' }
}, { timestamps: true });

// Text indices
EventSchema.index({ title: 'text', description: 'text', tags: 'text' });
// Compound indices for fast feed ranking
EventSchema.index({ status: 1, date: 1 });
EventSchema.index({ category: 1, date: 1 });

export const Event = mongoose.model('Event', EventSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { Event } from './Event';

export 

const RSVPSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type, enum: ['pending', 'attending', 'waitlisted', 'cancelled'], default: 'pending' },
  isCheckedIn: { type, default: false },
  checkInTime,
  guestsCount: { type, default: 0 }
}, { timestamps: true });

// Prevent double RSVPs
RSVPSchema.index({ user: 1, event: 1 }, { unique: true });

// Update denormalized event counters
RSVPSchema.post('save', async function(doc) {
  if (doc.status === 'attending') {
    await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: 1 } }).exec();
  }
});

RSVPSchema.post('findOneAndDelete', async function(doc: IRSVP | null) {
  if (doc && doc.status === 'attending') {
    await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: -1 } }).exec();
  }
});

export const RSVP = mongoose.model('RSVP', RSVPSchema);

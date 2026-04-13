import mongoose, { Schema, Document } from 'mongoose';
import { Event } from './Event';

export interface IRSVP extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  status: 'attending' | 'waitlisted' | 'cancelled';
  isCheckedIn: boolean;
  checkInTime?: Date;
  guestsCount: number;
}

const RSVPSchema = new Schema<IRSVP>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['attending', 'waitlisted', 'cancelled'], default: 'attending' },
  isCheckedIn: { type: Boolean, default: false },
  checkInTime: Date,
  guestsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent double RSVPs
RSVPSchema.index({ user: 1, event: 1 }, { unique: true });

// Update denormalized event counters
RSVPSchema.post<IRSVP>('save', async function(doc) {
  if (doc.status === 'attending') {
    await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: 1 } }).exec();
  }
});

RSVPSchema.post<IRSVP>('findOneAndDelete', async function(doc) {
  if (doc && doc.status === 'attending') {
    await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: -1 } }).exec();
  }
});

export const RSVP = mongoose.model<IRSVP>('RSVP', RSVPSchema);

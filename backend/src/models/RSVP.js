import mongoose, { Schema } from 'mongoose';
import { Event } from './Event.js';
const RSVPSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['pending', 'attending', 'waitlisted', 'cancelled'], default: 'pending' },
    isCheckedIn: { type: Boolean, default: false },
    checkInTime: Date,
    guestsCount: { type: Number, default: 0 }
}, { timestamps: true });
// Prevent double RSVPs
RSVPSchema.index({ user: 1, event: 1 }, { unique: true });
// Update denormalized event counters
RSVPSchema.post('save', async function (doc) {
    if (doc.status === 'attending') {
        await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: 1 } }).exec();
    }
});
RSVPSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.status === 'attending') {
        await Event.findByIdAndUpdate(doc.event, { $inc: { rsvpCount: -1 } }).exec();
    }
});
export const RSVP = mongoose.model('RSVP', RSVPSchema);

import mongoose, { Schema, Document } from 'mongoose';
import { Club } from './Club';

export 

const ClubMembershipSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  role: { type, enum: ['member', 'board', 'president'], default: 'member' },
  status: { type, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  engagementScore: { type, default: 0 }
}, { timestamps: true });

// Prevent duplicate memberships
ClubMembershipSchema.index({ user: 1, club: 1 }, { unique: true });

// Hook to maintain the denormalized member counter only when approved
ClubMembershipSchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    await Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: 1 } }).exec();
  }
});

ClubMembershipSchema.post('findOneAndDelete', async function(doc: IClubMembership | null) {
  if (doc && doc.status === 'approved') {
    await Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: -1 } }).exec();
  }
});

export const ClubMembership = mongoose.model('ClubMembership', ClubMembershipSchema);

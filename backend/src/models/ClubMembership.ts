import mongoose, { Schema, Document } from 'mongoose';
import { Club } from './Club';

export interface IClubMembership extends Document {
  user: mongoose.Types.ObjectId;
  club: mongoose.Types.ObjectId;
  role: 'member' | 'board' | 'president';
  status: 'pending' | 'approved' | 'rejected';
  engagementScore: number;
}

const ClubMembershipSchema = new Schema<IClubMembership>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  role: { type: String, enum: ['member', 'board', 'president'], default: 'member' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  engagementScore: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent duplicate memberships
ClubMembershipSchema.index({ user: 1, club: 1 }, { unique: true });

// Hook to maintain the denormalized member counter only when approved
ClubMembershipSchema.post<IClubMembership>('save', async function(doc) {
  if (doc.status === 'approved') {
    await Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: 1 } }).exec();
  }
});

ClubMembershipSchema.post('findOneAndDelete', async function(doc: IClubMembership | null) {
  if (doc && doc.status === 'approved') {
    await Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: -1 } }).exec();
  }
});

export const ClubMembership = mongoose.model<IClubMembership>('ClubMembership', ClubMembershipSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamProject extends Document {
  title: string;
  description: string;
  leader: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  requiredSkills: {
    skill: mongoose.Types.ObjectId;
    proficiencyDesired?: string;
  }[];
  pendingRequests: mongoose.Types.ObjectId[];
  associatedEvent?: mongoose.Types.ObjectId; // e.g., created for a specific hackathon
  deadline?: Date;
  status: 'open' | 'full' | 'completed';
}

const TeamProjectSchema = new Schema<ITeamProject>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requiredSkills: [{
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    proficiencyDesired: String
  }],
  pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  associatedEvent: { type: Schema.Types.ObjectId, ref: 'Event' },
  deadline: Date,
  status: { type: String, enum: ['open', 'full', 'completed'], default: 'open' }
}, { timestamps: true });

export const TeamProject = mongoose.model<ITeamProject>('TeamProject', TeamProjectSchema);

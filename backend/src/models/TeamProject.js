import mongoose, { Schema, Document } from 'mongoose';

export [];
  pendingRequests: mongoose.Types.ObjectId[];
  associatedEvent?: mongoose.Types.ObjectId; // e.g., created for a specific hackathon
  deadline?;
  status: 'open' | 'full' | 'completed';
  createdAt;
  updatedAt;
}

const TeamProjectSchema = new Schema({
  title: { type, required: true, trim: true },
  description: { type, required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  requiredSkills: [{
    skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    proficiencyDesired
  }],
  pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  associatedEvent: { type: Schema.Types.ObjectId, ref: 'Event' },
  deadline,
  status: { type, enum: ['open', 'full', 'completed'], default: 'open' }
}, { timestamps: true });

export const TeamProject = mongoose.model('TeamProject', TeamProjectSchema);

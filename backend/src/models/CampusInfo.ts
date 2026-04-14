import mongoose, { Schema, Document } from 'mongoose';

export interface ICampusInfo extends Document {
  category: 'dining' | 'academic' | 'faq' | 'general';
  topic: string; // e.g., "Student Union Dining Hall"
  content: string; // Detailed description or hours
  data?: any; // Structured data if needed (e.g., JSON hours)
  tags: string[];
}

const CampusInfoSchema = new Schema<ICampusInfo>({
  category: { 
    type: String, 
    enum: ['dining', 'academic', 'faq', 'general'], 
    required: true,
    index: true 
  },
  topic: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  tags: [{ type: String, lowercase: true, trim: true }]
}, { timestamps: true });

// Text index for standard search capability
CampusInfoSchema.index({ topic: 'text', content: 'text', tags: 'text' });

export const CampusInfo = mongoose.model<ICampusInfo>('CampusInfo', CampusInfoSchema);

import mongoose, { Schema, Document } from 'mongoose';

export 

const CampusInfoSchema = new Schema({
  category: { 
    type, 
    enum: ['dining', 'academic', 'faq', 'general'], 
    required: true,
    index: true 
  },
  topic: { type, required: true, unique: true, index: true },
  content: { type, required: true },
  data: { type: Schema.Types.Mixed },
  tags: [{ type, lowercase: true, trim: true }]
}, { timestamps: true });

// Text index for standard search capability
CampusInfoSchema.index({ topic: 'text', content: 'text', tags: 'text' });

export const CampusInfo = mongoose.model('CampusInfo', CampusInfoSchema);

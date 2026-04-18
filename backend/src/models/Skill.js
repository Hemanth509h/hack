import mongoose, { Schema, Document } from 'mongoose';

export 

const SkillSchema = new Schema({
  name: {
    type,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type,
    required: true,
    index: true,
  },
  aliases: [{
    type,
    lowercase: true,
    trim: true,
  }]
}, { timestamps: true });

// Text index for autocomplete searching
SkillSchema.index({ name: 'text', aliases: 'text' });

export const Skill = mongoose.model('Skill', SkillSchema);

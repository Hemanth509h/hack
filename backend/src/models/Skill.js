import mongoose, { Schema } from 'mongoose';
const SkillSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    category: {
        type: String,
        required: true,
        index: true,
    },
    aliases: [{
            type: String,
            lowercase: true,
            trim: true,
        }]
}, { timestamps: true });
// Text index for autocomplete searching
SkillSchema.index({ name: 'text', aliases: 'text' });
export const Skill = mongoose.model('Skill', SkillSchema);

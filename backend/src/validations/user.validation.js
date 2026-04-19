import Joi from 'joi';
export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    major: Joi.string().trim().max(100).allow(''),
    graduationYear: Joi.number().integer().min(2000).max(2100).allow(null),
    bio: Joi.string().trim().max(500).allow(''),
    portfolioLinks: Joi.object({
        github: Joi.string().uri().allow(''),
        linkedin: Joi.string().uri().allow(''),
        website: Joi.string().uri().allow('')
    }).optional(),
    notificationPreferences: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        inApp: Joi.boolean()
    }).optional()
});
export const updateInterestsSchema = Joi.object({
    interests: Joi.array().items(Joi.string().trim().max(50)).max(20).required()
});
export const addSkillSchema = Joi.object({
    skillId: Joi.string().hex().length(24).required()
});

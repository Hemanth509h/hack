import Joi from 'joi';
export const createClubSchema = Joi.object({
    name: Joi.string().required().trim().min(3).max(100),
    description: Joi.string().required().trim().min(20),
    category: Joi.string().required().valid('Tech', 'Arts', 'Debate', 'Sports', 'Music', 'Volley', 'Other'),
    logo: Joi.string().uri().allow('').optional(),
    coverImage: Joi.string().uri().allow('').optional(),
    socialLinks: Joi.object({
        website: Joi.string().uri().allow('').optional(),
        instagram: Joi.string().allow('').optional(),
        discord: Joi.string().allow('').optional()
    }).optional(),
    meetingSchedule: Joi.string().max(100).allow('').optional(),
    tags: Joi.array().items(Joi.string().trim().lowercase()).max(5).default([]),
    headId: Joi.string().required()
});
export const updateClubSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100),
    description: Joi.string().trim().min(20),
    category: Joi.string().valid('Tech', 'Arts', 'Debate', 'Sports', 'Music', 'Volley', 'Other'),
    logo: Joi.string().uri(),
    coverImage: Joi.string().uri(),
    socialLinks: Joi.object({
        website: Joi.string().uri(),
        instagram: Joi.string(),
        discord: Joi.string()
    }),
    meetingSchedule: Joi.string().max(100),
    tags: Joi.array().items(Joi.string().trim().lowercase()).max(5),
    status: Joi.string().valid('pending', 'active', 'inactive')
});
export const clubQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().allow(''),
    category: Joi.string().trim().allow(''),
    sortBy: Joi.string().valid('active', 'new', 'popular').default('popular')
});
export const updateMemberRoleSchema = Joi.object({
    role: Joi.string().valid('member', 'board', 'president').required()
});
export const announcementSchema = Joi.object({
    title: Joi.string().required().min(3).max(150),
    message: Joi.string().required().min(10).max(1000)
});

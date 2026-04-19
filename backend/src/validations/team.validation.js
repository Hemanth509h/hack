import Joi from 'joi';
export const createProjectSchema = Joi.object({
    title: Joi.string().required().trim().min(5).max(100),
    description: Joi.string().required().trim().min(20),
    requiredSkills: Joi.array().items(Joi.object({
        skill: Joi.string().hex().length(24).required(),
        proficiencyDesired: Joi.string().valid('beginner', 'intermediate', 'advanced').optional()
    })).min(1).required(),
    associatedEvent: Joi.string().hex().length(24).optional(),
    deadline: Joi.date().iso().greater('now').optional(),
    status: Joi.string().valid('open', 'full', 'completed').default('open')
});
export const updateProjectSchema = Joi.object({
    title: Joi.string().trim().min(5).max(100),
    description: Joi.string().trim().min(20),
    requiredSkills: Joi.array().items(Joi.object({
        skill: Joi.string().hex().length(24).required(),
        proficiencyDesired: Joi.string().valid('beginner', 'intermediate', 'advanced')
    })),
    deadline: Joi.date().iso(),
    status: Joi.string().valid('open', 'full', 'completed')
});
export const requestJoinSchema = Joi.object({
    message: Joi.string().trim().max(300).allow('').optional()
});
export const browseQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    skill: Joi.string().hex().length(24).optional(),
    event: Joi.string().hex().length(24).optional()
});

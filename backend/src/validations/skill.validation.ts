import Joi from 'joi';

export const createSkillSchema = Joi.object({
  name: Joi.string().required().trim().max(100),
  category: Joi.string().required().trim().max(100),
  aliases: Joi.array().items(Joi.string().trim()).max(10).default([])
});

export const searchSkillSchema = Joi.object({
  q: Joi.string().trim().allow('').default(''),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

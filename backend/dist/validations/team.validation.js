"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseQuerySchema = exports.requestJoinSchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProjectSchema = joi_1.default.object({
    title: joi_1.default.string().required().trim().min(5).max(100),
    description: joi_1.default.string().required().trim().min(20),
    requiredSkills: joi_1.default.array().items(joi_1.default.object({
        skill: joi_1.default.string().hex().length(24).required(),
        proficiencyDesired: joi_1.default.string().valid('beginner', 'intermediate', 'advanced').optional()
    })).min(1).required(),
    associatedEvent: joi_1.default.string().hex().length(24).optional(),
    deadline: joi_1.default.date().iso().greater('now').optional(),
    status: joi_1.default.string().valid('open', 'full', 'completed').default('open')
});
exports.updateProjectSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(5).max(100),
    description: joi_1.default.string().trim().min(20),
    requiredSkills: joi_1.default.array().items(joi_1.default.object({
        skill: joi_1.default.string().hex().length(24).required(),
        proficiencyDesired: joi_1.default.string().valid('beginner', 'intermediate', 'advanced')
    })),
    deadline: joi_1.default.date().iso(),
    status: joi_1.default.string().valid('open', 'full', 'completed')
});
exports.requestJoinSchema = joi_1.default.object({
    message: joi_1.default.string().trim().max(300).allow('').optional()
});
exports.browseQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(50).default(10),
    skill: joi_1.default.string().hex().length(24).optional(),
    event: joi_1.default.string().hex().length(24).optional()
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSkillSchema = exports.updateInterestsSchema = exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(2).max(100),
    major: joi_1.default.string().trim().max(100).allow(''),
    graduationYear: joi_1.default.number().integer().min(2000).max(2100).allow(null),
    bio: joi_1.default.string().trim().max(500).allow(''),
    portfolioLinks: joi_1.default.object({
        github: joi_1.default.string().uri().allow(''),
        linkedin: joi_1.default.string().uri().allow(''),
        website: joi_1.default.string().uri().allow('')
    }).optional(),
    notificationPreferences: joi_1.default.object({
        email: joi_1.default.boolean(),
        push: joi_1.default.boolean(),
        inApp: joi_1.default.boolean()
    }).optional()
});
exports.updateInterestsSchema = joi_1.default.object({
    interests: joi_1.default.array().items(joi_1.default.string().trim().max(50)).max(20).required()
});
exports.addSkillSchema = joi_1.default.object({
    skillId: joi_1.default.string().hex().length(24).required()
});

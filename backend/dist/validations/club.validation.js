"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementSchema = exports.updateMemberRoleSchema = exports.clubQuerySchema = exports.updateClubSchema = exports.createClubSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClubSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim().min(3).max(100),
    description: joi_1.default.string().required().trim().min(20),
    category: joi_1.default.string().required().valid('Tech', 'Arts', 'Debate', 'Sports', 'Music', 'Volley', 'Other'),
    logo: joi_1.default.string().uri().optional(),
    coverImage: joi_1.default.string().uri().optional(),
    socialLinks: joi_1.default.object({
        website: joi_1.default.string().uri().optional(),
        instagram: joi_1.default.string().uri().optional(),
        discord: joi_1.default.string().uri().optional()
    }).optional(),
    meetingSchedule: joi_1.default.string().max(100).optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim().lowercase()).max(5).default([])
});
exports.updateClubSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(3).max(100),
    description: joi_1.default.string().trim().min(20),
    category: joi_1.default.string().valid('Tech', 'Arts', 'Debate', 'Sports', 'Music', 'Volley', 'Other'),
    logo: joi_1.default.string().uri(),
    coverImage: joi_1.default.string().uri(),
    socialLinks: joi_1.default.object({
        website: joi_1.default.string().uri(),
        instagram: joi_1.default.string().uri(),
        discord: joi_1.default.string().uri()
    }),
    meetingSchedule: joi_1.default.string().max(100),
    tags: joi_1.default.array().items(joi_1.default.string().trim().lowercase()).max(5),
    status: joi_1.default.string().valid('pending', 'active', 'inactive')
});
exports.clubQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().trim().allow(''),
    category: joi_1.default.string().trim().allow(''),
    sortBy: joi_1.default.string().valid('active', 'new', 'popular').default('popular')
});
exports.updateMemberRoleSchema = joi_1.default.object({
    role: joi_1.default.string().valid('member', 'board', 'president').required()
});
exports.announcementSchema = joi_1.default.object({
    title: joi_1.default.string().required().min(3).max(150),
    message: joi_1.default.string().required().min(10).max(1000)
});

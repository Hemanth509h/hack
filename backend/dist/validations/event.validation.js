"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventQuerySchema = exports.updateEventSchema = exports.createEventSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createEventSchema = joi_1.default.object({
    title: joi_1.default.string().required().trim().min(5).max(100),
    description: joi_1.default.string().required().trim().min(20),
    category: joi_1.default.string().required().valid('Hackathon', 'Workshop', 'Cultural', 'Sports', 'Career', 'Social', 'Other'),
    club: joi_1.default.string().hex().length(24).optional(),
    location: joi_1.default.string().hex().length(24).optional(),
    locationDetails: joi_1.default.string().optional().allow(''),
    date: joi_1.default.date().iso().greater('now').required(),
    durationMinutes: joi_1.default.number().integer().min(15).max(1440).default(60),
    capacity: joi_1.default.number().integer().min(1).optional(),
    coverImage: joi_1.default.string().uri().optional(),
    tags: joi_1.default.array().items(joi_1.default.string().trim().lowercase()).max(10).default([]),
    targetAudience: joi_1.default.object({
        majors: joi_1.default.array().items(joi_1.default.string()).default([]),
        years: joi_1.default.array().items(joi_1.default.number().integer()).default([])
    }).default({ majors: [], years: [] }),
    status: joi_1.default.string().valid('draft', 'published').default('published'),
    organizerId: joi_1.default.string().required()
});
exports.updateEventSchema = joi_1.default.object({
    title: joi_1.default.string().trim().min(5).max(100),
    description: joi_1.default.string().trim().min(20),
    category: joi_1.default.string().valid('Hackathon', 'Workshop', 'Cultural', 'Sports', 'Career', 'Social', 'Other'),
    locationDetails: joi_1.default.string().allow(''),
    date: joi_1.default.date().iso(),
    durationMinutes: joi_1.default.number().integer().min(15).max(1440),
    capacity: joi_1.default.number().integer().min(1),
    coverImage: joi_1.default.string().uri(),
    tags: joi_1.default.array().items(joi_1.default.string().trim().lowercase()).max(10),
    status: joi_1.default.string().valid('draft', 'published', 'cancelled')
});
exports.eventQuerySchema = joi_1.default.object({
    page: joi_1.default.number().integer().min(1).default(1),
    limit: joi_1.default.number().integer().min(1).max(100).default(10),
    search: joi_1.default.string().trim().allow(''),
    category: joi_1.default.string().trim(),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().greater(joi_1.default.ref('startDate')),
    club: joi_1.default.string().hex().length(24),
    sortBy: joi_1.default.string().valid('date', 'popularity', 'newest').default('date')
});

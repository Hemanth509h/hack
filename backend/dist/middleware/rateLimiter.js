"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 10, // Limit each IP to 10 requests per windowMs for auth routes
    message: {
        status: 429,
        error: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
    },
    standardHeaders: 'draft-7', // Draft-7: combined RateLimit header
    legacyHeaders: false, // Disable X-RateLimit-* headers
});

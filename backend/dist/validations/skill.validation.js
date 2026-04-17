"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSkillSchema = exports.createSkillSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSkillSchema = joi_1.default.object({
    name: joi_1.default.string().required().trim().max(100),
    category: joi_1.default.string().required().trim().max(100),
    aliases: joi_1.default.array().items(joi_1.default.string().trim()).max(10).default([])
});
exports.searchSkillSchema = joi_1.default.object({
    q: joi_1.default.string().trim().allow('').default(''),
    limit: joi_1.default.number().integer().min(1).max(50).default(10)
});

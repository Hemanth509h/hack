"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAdminAction = void 0;
const AuditLog_1 = require("../models/AuditLog");
const mongoose_1 = __importDefault(require("mongoose"));
const logAdminAction = async (adminId, action, resource, resourceId, metadata) => {
    try {
        await AuditLog_1.AuditLog.create({
            adminId: new mongoose_1.default.Types.ObjectId(adminId),
            action,
            resource,
            resourceId: resourceId ? new mongoose_1.default.Types.ObjectId(resourceId) : undefined,
            metadata,
        });
    }
    catch (error) {
        console.error('[audit-service]: Failed to log admin action:', error);
        // Don't throw - audit logging should not break the main workflow
    }
};
exports.logAdminAction = logAdminAction;

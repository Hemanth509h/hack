"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubMembership = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Club_1 = require("./Club");
const ClubMembershipSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    club: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Club', required: true },
    role: { type: String, enum: ['member', 'board', 'president'], default: 'member' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    engagementScore: { type: Number, default: 0 }
}, { timestamps: true });
// Prevent duplicate memberships
ClubMembershipSchema.index({ user: 1, club: 1 }, { unique: true });
// Hook to maintain the denormalized member counter only when approved
ClubMembershipSchema.post('save', async function (doc) {
    if (doc.status === 'approved') {
        await Club_1.Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: 1 } }).exec();
    }
});
ClubMembershipSchema.post('findOneAndDelete', async function (doc) {
    if (doc && doc.status === 'approved') {
        await Club_1.Club.findByIdAndUpdate(doc.club, { $inc: { memberCount: -1 } }).exec();
    }
});
exports.ClubMembership = mongoose_1.default.model('ClubMembership', ClubMembershipSchema);

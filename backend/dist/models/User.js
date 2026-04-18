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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true, trim: true,
    },
    password: { type: String },
    role: {
        type: String, enum: ['student', 'club_leader', 'admin'], default: 'student',
    },
    name: { type: String, required: true, trim: true },
    avatar: { type: String },
    major: { type: String, trim: true },
    graduationYear: { type: Number },
    bio: { type: String, trim: true, maxlength: 500 },
    portfolioLinks: {
        github: String,
        linkedin: String,
        website: String
    },
    skills: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Skill' }],
    interests: [{ type: String, trim: true }],
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
    },
    homeLocation: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    },
    providers: { googleId: String, microsoftId: String },
    isEmailVerified: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Gamification
    points: { type: Number, default: 0 },
    badges: [{
            name: { type: String, required: true },
            icon: { type: String, required: true },
            unlockedAt: { type: Date, default: Date.now }
        }],
}, { timestamps: true });
UserSchema.index({ homeLocation: '2dsphere' });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password)
        return next();
    try {
        const salt = await bcrypt_1.default.genSalt(10);
        this.password = await bcrypt_1.default.hash(this.password, salt);
        return next();
    }
    catch (error) {
        return next(error);
    }
});
UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return bcrypt_1.default.compare(candidatePassword, this.password);
};
exports.User = mongoose_1.default.model('User', UserSchema);

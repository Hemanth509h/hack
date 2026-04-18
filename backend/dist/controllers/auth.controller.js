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
exports.getMe = exports.resetPassword = exports.forgotPassword = exports.logoutUser = exports.refreshToken = exports.loginUser = exports.verifyEmail = exports.registerUser = void 0;
const User_1 = require("../models/User");
const jwt_utils_1 = require("../utils/jwt.utils");
const email_utils_1 = require("../utils/email.utils");
const crypto_1 = __importDefault(require("crypto"));
/**
 * @desc    Register a new local user
 * @route   POST /api/auth/register
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, major, graduationYear, interests } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const exists = await User_1.User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // const verificationToken = crypto.randomBytes(20).toString('hex');
        // Create pre-verified user
        // Normalize interests and ensure graduationYear is not NaN
        const user = await User_1.User.create({
            name,
            email: email.toLowerCase(),
            password,
            major,
            graduationYear: (graduationYear && !isNaN(Number(graduationYear))) ? Number(graduationYear) : undefined,
            interests: Array.isArray(interests) ? interests : [],
            isEmailVerified: true, // Force verify
        });
        res.status(201).json({
            message: 'Registration successful. You can now log in.',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch (error) {
        console.error('[auth]: Registration error:', error);
        res.status(500).json({
            error: 'Server error during registration',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.registerUser = registerUser;
/**
 * @desc    Verify Email Token
 * @route   POST /api/auth/verify-email
 */
const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;
        const user = await User_1.User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }
        user.isEmailVerified = true;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Email successfully verified' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error during verification' });
    }
};
exports.verifyEmail = verifyEmail;
/**
 * @desc    Login generating JWT pair
 * @route   POST /api/auth/login
 */
const loginUser = async (req, res) => {
    try {
        const user = req.user; // Attached by Passport local strategy
        // if (!user.isEmailVerified) {
        //   return res.status(403).json({ error: 'Please verify your email before logging in.' });
        // }
        const tokens = await (0, jwt_utils_1.generateTokens)({ userId: user._id, role: user.role });
        res.json({
            message: 'Logged in successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            ...tokens,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};
exports.loginUser = loginUser;
/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh
 */
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ error: 'Refresh token is required' });
        const newTokens = await (0, jwt_utils_1.verifyAndRefreshTokens)(token);
        res.json(newTokens);
    }
    catch (error) {
        res.status(401).json({ error: error.message || 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
/**
 * @desc    Logout (Invalidate token in Redis)
 * @route   POST /api/auth/logout
 */
const logoutUser = async (req, res) => {
    try {
        const { token } = req.body;
        const { verifyRefreshToken } = await Promise.resolve().then(() => __importStar(require('../utils/jwt.utils')));
        const payload = verifyRefreshToken(token);
        await (0, jwt_utils_1.revokeTokens)(payload.userId);
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to process logout' });
    }
};
exports.logoutUser = logoutUser;
/**
 * @desc    Request Password Reset Link
 * @route   POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user || user.providers?.googleId || user.providers?.microsoftId) {
            // Don't leak if user exists, and block OAuth users from resetting non-existent passwords
            return res.status(200).json({ message: 'If an account exists, a reset link was sent.' });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
        await (0, email_utils_1.sendEmail)({
            to: user.email,
            subject: 'Password Reset Request - The Quad',
            text: `You requested a password reset. Please go to: \n${resetUrl}\nIf you did not request this, please ignore this email.`,
        });
        res.json({ message: 'If an account exists, a reset link was sent.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error processing forgot password' });
    }
};
exports.forgotPassword = forgotPassword;
/**
 * @desc    Execute Password Reset
 * @route   POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;
        const user = await User_1.User.findOne({
            email: email.toLowerCase(),
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ error: 'Token is invalid or has expired' });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        // Revoke any active sessions when password changes
        await (0, jwt_utils_1.revokeTokens)(user._id.toString());
        res.json({ message: 'Password has been successfully reset' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error resetting password' });
    }
};
exports.resetPassword = resetPassword;
/**
 * @desc    Get Current User
 * @route   GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await User_1.User.findById(userId).select('name email role avatar');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            message: 'You have access',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error fetching user' });
    }
};
exports.getMe = getMe;

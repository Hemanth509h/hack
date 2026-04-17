"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../config/passport"));
const jwt_utils_1 = require("../utils/jwt.utils");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// --- Local Flows ---
router.post('/register', rateLimiter_1.authRateLimiter, auth_controller_1.registerUser);
router.post('/verify-email', auth_controller_1.verifyEmail);
router.post('/login', rateLimiter_1.authRateLimiter, passport_1.default.authenticate('local', { session: false }), auth_controller_1.loginUser);
router.post('/refresh', auth_controller_1.refreshToken);
router.post('/logout', auth_controller_1.logoutUser);
router.post('/forgot-password', rateLimiter_1.authRateLimiter, auth_controller_1.forgotPassword);
router.post('/reset-password', rateLimiter_1.authRateLimiter, auth_controller_1.resetPassword);
// --- Google OAuth Flows ---
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false, failureRedirect: '/login-failed' }), async (req, res) => {
    try {
        const user = req.user;
        const tokens = await (0, jwt_utils_1.generateTokens)({ userId: user._id, role: user.role });
        // Pass tokens back to frontend via URL redirect (or a secure cookie depending on strict frontend choice)
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    }
    catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
});
// --- Microsoft OAuth Flows ---
router.get('/microsoft', passport_1.default.authenticate('microsoft', { prompt: 'select_account' }));
router.get('/microsoft/callback', passport_1.default.authenticate('microsoft', { session: false, failureRedirect: '/login-failed' }), async (req, res) => {
    try {
        const user = req.user;
        const tokens = await (0, jwt_utils_1.generateTokens)({ userId: user._id, role: user.role });
        res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    }
    catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
});
// --- Protected Test Route ---
router.get('/me', auth_middleware_1.requireAuth, (req, res) => {
    res.json({ message: 'You have access', user: req.user });
});
exports.default = router;

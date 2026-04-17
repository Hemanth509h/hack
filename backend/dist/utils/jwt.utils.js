"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeTokens = exports.verifyAndRefreshTokens = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../config/redis");
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
/**
 * Generate Access and Refresh Tokens
 */
const generateTokens = async (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
    const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
    // Store the refresh token in Redis mapped to userId
    // e.g. "refreshToken:userId" -> "abc123token", expires in 7 days (604800 seconds)
    await redis_1.redisClient.setEx(`refreshToken:${payload.userId}`, 604800, refreshToken);
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify a Refresh Token (without rotating — used for logout)
 */
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Verify Refresh Token, ensuring it exists in Redis (to allow manual revocation/logout)
 */
const verifyAndRefreshTokens = async (refreshToken) => {
    const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
    // Search Redis to see if the session is still valid
    const storedToken = await redis_1.redisClient.get(`refreshToken:${payload.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Refresh token revoked or invalid');
    }
    // Tokens match and hash validated, generate new set
    return await (0, exports.generateTokens)({ userId: payload.userId, role: payload.role });
};
exports.verifyAndRefreshTokens = verifyAndRefreshTokens;
/**
 * Revoke tokens by killing session out of Redis
 */
const revokeTokens = async (userId) => {
    await redis_1.redisClient.del(`refreshToken:${userId}`);
};
exports.revokeTokens = revokeTokens;

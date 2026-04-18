import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export 

/**
 * Generate Access and Refresh Tokens
 */
export const generateTokens = async (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES as any });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES as any });
  
  // Store the refresh token in Redis mapped to userId
  // e.g. "refreshToken:userId" -> "abc123token", expires in 7 days (604800 seconds)
  await redisClient.setEx(`refreshToken:${payload.userId}`, 604800, refreshToken);

  return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify a Refresh Token (without rotating — used for logout)
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

/**
 * Verify Refresh Token, ensuring it exists in Redis (to allow manual revocation/logout)
 */
export const verifyAndRefreshTokens = async (refreshToken) => {
  const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  
  // Search Redis to see if the session is still valid
  const storedToken = await redisClient.get(`refreshToken:${payload.userId}`);
  
  if (!storedToken || storedToken !== refreshToken) {
    throw new Error('Refresh token revoked or invalid');
  }

  // Tokens match and hash validated, generate new set
  return await generateTokens({ userId: payload.userId, role: payload.role });
};

/**
 * Revoke tokens by killing session out of Redis
 */
export const revokeTokens = async (userId) => {
  await redisClient.del(`refreshToken:${userId}`);
};

import { Router } from 'express';
import passport from '../config/passport';
import { generateTokens } from '../utils/jwt.utils';
import { authRateLimiter } from '../middleware/rateLimiter';
import { requireAuth } from '../middleware/auth.middleware';
import {
  registerUser,
  verifyEmail,
  loginUser,
  refreshToken,
  logoutUser,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';

const router = Router();

// --- Local Flows ---
router.post('/register', authRateLimiter, registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', authRateLimiter, passport.authenticate('local', { session: false }), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);

// --- Google OAuth Flows ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login-failed' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const tokens = await generateTokens({ userId: user._id, role: user.role });
      
      // Pass tokens back to frontend via URL redirect (or a secure cookie depending on strict frontend choice)
      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    } catch (err) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// --- Microsoft OAuth Flows ---
router.get('/microsoft', passport.authenticate('microsoft', { prompt: 'select_account' }));

router.get('/microsoft/callback', 
  passport.authenticate('microsoft', { session: false, failureRedirect: '/login-failed' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const tokens = await generateTokens({ userId: user._id, role: user.role });
      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    } catch (err) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// --- Protected Test Route ---
router.get('/me', requireAuth, (req, res) => {
  res.json({ message: 'You have access', user: (req as any).user });
});

export default router;

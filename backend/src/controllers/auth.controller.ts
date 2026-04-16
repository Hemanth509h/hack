import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateTokens, verifyAndRefreshTokens, revokeTokens } from '../utils/jwt.utils';
import { sendEmail } from '../utils/email.utils';
import crypto from 'crypto';

/**
 * @desc    Register a new local user
 * @route   POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, major, graduationYear, interests } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    // Create unverified user
    const user = await User.create({
      name,
      email,
      password,
      major,
      graduationYear,
      interests,
      resetPasswordToken: verificationToken, // Reusing field for email verify token initially
      resetPasswordExpires: Date.now() + 24 * 3600000, // 24 hours
    });

    // Send welcome / verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: 'Welcome to The Quad! Please Verify Your Email.',
      text: `Hello ${user.name},\n\nPlease verify your account by clicking the link: \n${verifyUrl}\n\nThanks,\nThe Quad Team`,
    });

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error during registration', details: error.message });
  }
};

/**
 * @desc    Verify Email Token
 * @route   POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({
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
  } catch (error) {
    res.status(500).json({ error: 'Server error during verification' });
  }
};

/**
 * @desc    Login generating JWT pair
 * @route   POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as any; // Attached by Passport local strategy

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const tokens = await generateTokens({ userId: user._id, role: user.role });
    res.json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Refresh token is required' });

    const newTokens = await verifyAndRefreshTokens(token);
    res.json(newTokens);
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid refresh token' });
  }
};

/**
 * @desc    Logout (Invalidate token in Redis)
 * @route   POST /api/auth/logout
 */
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body; // refresh token to wipe
    const payload = await verifyAndRefreshTokens(token); // To extract user securely
    await revokeTokens(payload.userId);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to process logout' });
  }
};

/**
 * @desc    Request Password Reset Link
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.providers?.googleId || user.providers?.microsoftId) {
      // Don't leak if user exists, and block OAuth users from resetting non-existent passwords
      return res.status(200).json({ message: 'If an account exists, a reset link was sent.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - The Quad',
      text: `You requested a password reset. Please go to: \n${resetUrl}\nIf you did not request this, please ignore this email.`,
    });

    res.json({ message: 'If an account exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error processing forgot password' });
  }
};

/**
 * @desc    Execute Password Reset
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({
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
    await revokeTokens(user._id as string);

    res.json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ error: 'Server error resetting password' });
  }
};

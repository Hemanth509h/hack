"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_microsoft_1 = require("passport-microsoft");
const User_1 = require("../models/User");
// Serialize user into the session/cookie (JWT relies on token but passport requires these)
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
// --- Local Strategy (Email/Password) ---
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User_1.User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password.' });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
// --- Google Strategy ---
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
if (googleClientId) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: googleClientId,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User_1.User.findOne({ 'providers.googleId': profile.id });
            if (user) {
                return done(null, user);
            }
            // User exists with same email but different provider?
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            if (email) {
                user = await User_1.User.findOne({ email });
                if (user) {
                    // Update existing user to link google id
                    user.providers.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }
            }
            // Create new Google User
            user = await User_1.User.create({
                name: profile.displayName,
                email: email || `${profile.id}@google.temp.com`, // Fallback
                providers: { googleId: profile.id },
                isEmailVerified: true, // Google emails are pre-verified
            });
            return done(null, user);
        }
        catch (err) {
            return done(err, undefined);
        }
    }));
}
// --- Microsoft Strategy (AAD) ---
const msClientId = process.env.MICROSOFT_CLIENT_ID || '';
if (msClientId) {
    passport_1.default.use(new passport_microsoft_1.Strategy({
        clientID: msClientId,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/microsoft/callback',
        scope: ['user.read'],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User_1.User.findOne({ 'providers.microsoftId': profile.id });
            if (user)
                return done(null, user);
            const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
            if (email) {
                user = await User_1.User.findOne({ email });
                if (user) {
                    user.providers.microsoftId = profile.id;
                    await user.save();
                    return done(null, user);
                }
            }
            user = await User_1.User.create({
                name: profile.displayName,
                email: email || `${profile.id}@microsoft.temp.com`,
                providers: { microsoftId: profile.id },
                isEmailVerified: true,
            });
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }));
}
exports.default = passport_1.default;

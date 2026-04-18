import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { User } from "../models/User";

// Serialize user into the session/cookie (JWT relies on token but passport requires these)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --- Local Strategy (Email/Password) ---
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: "Invalid email or password." });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// --- Google Strategy ---
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
if (googleClientId) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ "providers.googleId": profile.id });
          if (user) {
            return done(null, user);
          }
          // User exists with same email but different provider?
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              // Update existing user to link google id
              user.providers.googleId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          // Create new Google User
          user = await User.create({
            name: profile.displayName,
            email: email || `${profile.id}@google.temp.com`, // Fallback
            providers: { googleId: profile.id },
            isEmailVerified: true, // Google emails are pre-verified
          });
          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      },
    ),
  );
}

// --- Microsoft Strategy (AAD) ---
const msClientId = process.env.MICROSOFT_CLIENT_ID || "";
if (msClientId) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: msClientId,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
        callbackURL:
          process.env.MICROSOFT_CALLBACK_URL || "/api/auth/microsoft/callback",
        scope: ["user.read"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            "providers.microsoftId": profile.id,
          });
          if (user) return done(null, user);

          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.providers.microsoftId = profile.id;
              await user.save();
              return done(null, user);
            }
          }

          user = await User.create({
            name: profile.displayName,
            email: email || `${profile.id}@microsoft.temp.com`,
            providers: { microsoftId: profile.id },
            isEmailVerified: true,
          });

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
}

export default passport;

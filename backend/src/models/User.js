import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export ;
  
  skills: mongoose.Types.ObjectId[];
  interests: string[];

  // Notification Preferences
  notificationPreferences: {
    email;
    inApp;
  };

  // Geolocation
  homeLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Auth fields
  providers: {
    googleId?;
    microsoftId?;
  };
  isEmailVerified;
  resetPasswordToken?;
  resetPasswordExpires?;

  // Gamification
  points;
  badges: {
    name;
    icon;
    unlockedAt;
  }[];

  comparePassword(candidate);
}

const UserSchema = new Schema({
  email: {
    type, required: true, unique: true, lowercase: true, trim: true,
  },
  password: { type: String },
  role: {
    type, enum: ['student', 'club_leader', 'admin'], default: 'student',
  },
  name: { type, required: true, trim: true },
  avatar: { type: String },
  
  major: { type, trim: true },
  graduationYear: { type: Number },
  bio: { type, trim: true, maxlength: 500 },
  portfolioLinks: {
    github,
    linkedin,
    website
  },
  
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
  interests: [{ type, trim: true }],

  notificationPreferences: {
    email: { type, default: true },
    inApp: { type, default: true },
  },

  homeLocation: {
    type: {
      type,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },

  providers: { googleId, microsoftId: String },
  isEmailVerified: { type, default: true },
  resetPasswordToken,
  resetPasswordExpires,

  // Gamification
  points: { type, default: 0 },
  badges: [{
    name: { type, required: true },
    icon: { type, required: true },
    unlockedAt: { type, default: Date.now }
  }],
}, { timestamps: true });

UserSchema.index({ homeLocation: '2dsphere' });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', UserSchema);

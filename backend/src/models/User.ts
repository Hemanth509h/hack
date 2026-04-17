import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'student' | 'club_leader' | 'admin';
  name: string;
  avatar?: string;
  
  // Profile Enrichment
  major?: string;
  graduationYear?: number;
  bio?: string;
  portfolioLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  
  skills: mongoose.Types.ObjectId[];
  interests: string[];

  // Notification Preferences
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };

  // Geolocation
  homeLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Auth fields
  providers: {
    googleId?: string;
    microsoftId?: string;
  };
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Gamification
  points: number;
  badges: {
    name: string;
    icon: string;
    unlockedAt: Date;
  }[];

  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
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
  
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
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

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

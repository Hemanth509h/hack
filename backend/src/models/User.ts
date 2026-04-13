import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password?: string; // Optional for OAuth users
  role: 'student' | 'club_leader' | 'admin';
  name: string;
  
  // OAuth details
  providers: {
    googleId?: string;
    microsoftId?: string;
  };

  // Auth flags
  isEmailVerified: boolean;
  
  // Reset token mechanism
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Validation
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String, // Kept optional for Google/MS OAuth only flows
  },
  role: {
    type: String,
    enum: ['student', 'club_leader', 'admin'],
    default: 'student',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  providers: {
    googleId: String,
    microsoftId: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Pre-save hook to hash password if it was modified
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Instance method to compare hashed passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // OAuth users won't have a password.
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const promoteUser = async (email) => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quad';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`User ${email} not found`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`User ${email} promoted to admin successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user:', error);
    process.exit(1);
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email address: node promote-admin.js user@example.com');
  process.exit(1);
}

promoteUser(email);

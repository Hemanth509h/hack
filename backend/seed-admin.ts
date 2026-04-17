import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from './src/models/User';

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hack');
    console.log('Connected to DB');

    const adminEmail = 'admin@quad.edu';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists:', admin.email);
    } else {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'Password123!',
        role: 'admin',
        isEmailVerified: true
      });
      console.log('Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password: Password123!');
    }

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();

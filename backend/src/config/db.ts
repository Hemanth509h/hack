import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/the-quad';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[database]: Error: ${error.message}`);
    process.exit(1);
  }
};

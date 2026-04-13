import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, handleGracefulShutdown } from './config/db';

import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import clubRoutes from './routes/club.routes';
import userRoutes from './routes/user.routes';
import skillRoutes from './routes/skill.routes';
import teamRoutes from './routes/team.routes';
import { connectRedis } from './config/redis';
import passport from './config/passport';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

// Authentication Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/teams', teamRoutes);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    // Register graceful shutdown for process interruption signals
    handleGracefulShutdown();

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

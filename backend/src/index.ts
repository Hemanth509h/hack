import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectDB, handleGracefulShutdown } from './config/db';

import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import clubRoutes from './routes/club.routes';
import userRoutes from './routes/user.routes';
import skillRoutes from './routes/skill.routes';
import teamRoutes from './routes/team.routes';
import notificationRoutes from './routes/notification.routes';
import chatRoutes from './routes/chat.routes';
import searchRoutes from './routes/search.routes';
import discoveryRoutes from './routes/discovery.routes';
import adminRoutes from './routes/admin.routes';
import aiRoutes from './routes/ai.routes';

import { connectRedis } from './config/redis';
import passport from './config/passport';
import { initializeSocket } from './config/socket';
import { initializeFirebase } from './services/push.service';
import { startNotificationWorker } from './workers/notification.worker';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Wrap express in native HTTP server so Socket.io can attach
const httpServer = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/discovery', discoveryRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    // Initialize Socket.io with Redis adapter (async — must await)
    await initializeSocket(httpServer);

    // Initialize Firebase Admin for push notifications (graceful if not configured)
    initializeFirebase();

    // Start BullMQ notification worker
    startNotificationWorker();

    // Register graceful shutdown for process interruption signals
    handleGracefulShutdown();

    httpServer.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

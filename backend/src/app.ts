import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import passport from './config/passport';

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
import uploadRoutes from './routes/upload.routes';
import emailRoutes from './routes/email.routes';
import analyticsRoutes from './routes/analytics.routes';
import locationRoutes from './routes/location.routes';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.use('/api/v1/auth', authRoutes);
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
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/emails', emailRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/locations', locationRoutes);

export default app;

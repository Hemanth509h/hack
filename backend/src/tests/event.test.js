import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { Event } from '../models/Event';
import mongoose from 'mongoose';

describe('Event API', () => {
  let token;
  let adminToken;
  let userId;
  let adminId;

  beforeEach(async () => {
    // Register standard user and get token
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Event Organizer',
      email: 'organizer@quad.edu',
      password: 'Password123!'
    });
    token = res.body.token;
    userId = res.body.user._id;

    const adminRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin User',
      email: 'admin@quad.edu',
      password: 'Password123!'
    });
    adminToken = adminRes.body.token;
    adminId = adminRes.body.user._id;

    // Manually set role to admin as register defaults to student
    await User.findByIdAndUpdate(adminId, { role: 'admin' });
    await User.findByIdAndUpdate(userId, { role: 'club_leader' }); // Allow event creation
  });

  const validEvent = {
    title: 'Test Event',
    description: 'This is a test event',
    category: 'academic',
    date: new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: 60,
    tags: ['hackathon']
  };

  describe('POST /api/v1/events', () => {
    it('should create an event successfully as club leader', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .set('Authorization', `Bearer ${token}`)
        .send(validEvent);

      expect(response.status).toBe(201);
      expect(response.body.event.title).toBe(validEvent.title);
      expect(response.body.event.organizer).toBe(userId);
    });

    it('should reject creation without auth token', async () => {
      const response = await request(app)
        .post('/api/v1/events')
        .send(validEvent);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/events/:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = await Event.create({ ...validEvent, organizer: userId, status: 'published' });
      eventId = event._id.toString();
    });

    it('should fetch event by ID successfully', async () => {
      const response = await request(app).get(`/api/v1/events/${eventId}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(validEvent.title);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app).get(`/api/v1/events/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});

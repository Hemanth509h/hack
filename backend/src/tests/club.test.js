import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { Club } from '../models/Club';

describe('Club API', () => {
  let token;
  let adminToken;
  let userId;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Club Leader',
      email: 'leader@quad.edu',
      password: 'Password123!'
    });
    token = res.body.token;
    userId = res.body.user._id;

    // Upgrade to club_leader to create clubs (hypothetical permissions check)
    await User.findByIdAndUpdate(userId, { role: 'club_leader' });

    const adminRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin',
      email: 'admin@quad.edu',
      password: 'Password123!'
    });
    adminToken = adminRes.body.token;
    await User.findByIdAndUpdate(adminRes.body.user._id, { role: 'admin' });
  });

  const validClub = {
    name: 'Tech Innovators',
    description: 'A club for tech enthusiasts',
    category: 'Technology',
    meetingSchedule: 'Fridays at 5 PM',
  };

  describe('POST /api/v1/clubs', () => {
    it('should allow club creation with valid data', async () => {
      const response = await request(app)
        .post('/api/v1/clubs')
        .set('Authorization', `Bearer ${token}`)
        .send(validClub);

      expect(response.status).toBe(201);
      expect(response.body.club.name).toBe(validClub.name);
      // Clubs are typically immediately pending or approved
      expect(response.body.club).toHaveProperty('status');
    });
  });

  describe('GET /api/v1/clubs/:id', () => {
    let clubId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/v1/clubs')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...validClub, status: 'approved' });
        
      clubId = res.body.club._id;
      // Force approved state in DB if needed to be discoverable
      await Club.findByIdAndUpdate(clubId, { status: 'approved' });
    });

    it('should return club data', async () => {
      const res = await request(app).get(`/api/v1/clubs/${clubId}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(validClub.name);
    });
  });
});

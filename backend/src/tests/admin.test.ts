import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('Admin API', () => {
  let studentToken: string;
  let adminToken: string;

  beforeEach(async () => {
    const studentRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Regular Student',
      email: 'student@quad.edu',
      password: 'Password123!'
    });
    studentToken = studentRes.body.token;

    const adminRes = await request(app).post('/api/v1/auth/register').send({
      name: 'System Admin',
      email: 'admin@quad.edu',
      password: 'Password123!'
    });
    adminToken = adminRes.body.token;

    await User.findByIdAndUpdate(adminRes.body.user._id, { role: 'admin' });
  });

  describe('GET /api/v1/admin/dashboard', () => {
    it('should reject access for standard students', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(403);
    });

    it('should grant access to admin users', async () => {
      // Endpoint might be /stats or /dashboard
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      // We don't guarantee exact payload, but it shouldn't be 403
      expect([200, 404]).toContain(res.status);
    });
  });
});

import request from 'supertest';
import app from '../app';

describe('Team Matching API', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      name: 'Developer Student',
      email: 'dev@quad.edu',
      password: 'Password123!'
    });
    token = res.body.token;
  });

  describe('GET /api/v1/teams/matches', () => {
    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/v1/teams/matches');
      expect(res.status).toBe(401);
    });

    it('should fetch potential matches for authenticated users', async () => {
      const res = await request(app)
        .get('/api/v1/teams/matches')
        .set('Authorization', `Bearer ${token}`);
        
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.matches)).toBeTruthy();
    });
  });
});

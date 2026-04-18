import request from 'supertest';
import app from '../app';
import { User } from '../models/User';

describe('Auth API', () => {
  const validUser = {
    name: 'Test Student',
    email: 'student@example.edu',
    password: 'Password123!',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toHaveProperty('_id');
      expect(response.body.user.email).toBe(validUser.email);
      expect(response.body).toHaveProperty('token');
      
      const dbUser = await User.findOne({ email: validUser.email });
      expect(dbUser).toBeTruthy();
    });

    it('should fail with validation error for weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ ...validUser, password: 'weak' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate email', async () => {
      await User.create({ ...validUser, role: 'student' });
      
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email already registered');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(validUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(validUser.email);
    });

    it('should fail login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: validUser.email, password: 'WrongPassword123!' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});

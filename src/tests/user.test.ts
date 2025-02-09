import request from 'supertest';
import App from '../App';
const app = new App().getApp();
describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test2@gmail.com',
      password: 'Test12@',
    });
    expect(res.status).toBe(400);
    expect(res.body.data).toBeFalsy();
  });
});

describe('Auth Endpoints2', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@gmail.com',
        password: 'Test12@',
      });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.accessToken');
    });
  });
  
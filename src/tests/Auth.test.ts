import request from 'supertest';
import { global } from './config/jest.setup';

class AuthTest {
  async testUserRegistration() {
    describe('User Registration', () => {
      it('should register a new user successfully', async () => {
        const res = await request(global.app).post('/api/v1/auth/register').send({
          email: 'test3@gmail.com',
          password: 'Test12@',
          fullName: 'Test Test',
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.success).toBe(true);
      });

      it('should fail to register a user with an existing email', async () => {
        await request(global.app).post('/api/v1/auth/register').send({
          email: 'test1@gmail.com',
          password: 'Test12@',
          fullName: 'Test Test',
        });

        const res = await request(global.app).post('/api/v1/auth/register').send({
          email: 'test1@gmail.com',
          password: 'Test12@',
          fullName: 'Test Test',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should fail if password is too weak', async () => {
        const res = await request(global.app).post('/api/v1/auth/register').send({
          email: 'test1@gmail.com',
          password: '123',
          fullName: 'Test Test',
        });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }

  async testUserLogin() {
    describe('User Login', () => {
      it('should login successfully with valid credentials', async () => {
        const res = await request(global.app).post('/api/v1/auth/login').send({
          email: 'test@gmail.com',
          password: 'Test12@',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.success).toBe(true);
      });

      it('should fail to login with invalid credentials', async () => {
        const res = await request(global.app).post('/api/v1/auth/login').send({
          email: 'test@gmail.com',
          password: 'Test12',
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should fail to login with a non-existing user', async () => {
        const res = await request(global.app).post('/api/v1/auth/login').send({
          email: 'gmail@gmail.com',
          password: 'Test12@',
        });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });
  }
}

const authTest = new AuthTest();

authTest.testUserRegistration();
authTest.testUserLogin();

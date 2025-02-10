import RedisClient from '../../shared/services/RedisClient';
import App from '../../App';
import request from 'supertest';
import { Application } from 'express';
import { testSeeder } from '../utils/TestSeeder';
import { User } from '../../modules/auth/models/entity/User';
import { EventModel } from '../../modules/events/models/entity/EventModel';
import { Booking } from '../../modules/bookings/models/entity/Booking';

class Global {
  public app: Application;
  public appInstance: App;
  public testData: {
    users: Partial<User>[];
    events: Partial<EventModel>[];
    bookings: Partial<Booking>[];
  } = { users: [], events: [], bookings: [] };
  constructor() {
    const appInstance = new App();
    this.appInstance = appInstance;
    this.app = appInstance.getApp();
    beforeAll(async () => {
      await appInstance.connectDatabase();
      await testSeeder.cleanDatabase();
      this.testData = await testSeeder.seedTestData();
    });

    afterAll(async () => {
      await testSeeder.cleanDatabase();
      await this.appInstance.disconnectDatabase();
      await RedisClient.getInstance().disconnect();
    });
  }

  async loginUser() {
    const res = await request(this.app).post('/api/v1/auth/login').send({
      email: global.testData.users[0].email,
      password: global.testData.users[0].password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data.accessToken');
    expect(res.body.success).toBe(true);
    return res.body.data.accessToken;
  }
}

const global = new Global();
export { global };

import RedisClient from '../shared/services/RedisClient';
import App from '../App';
import { Application } from 'express';

export default class global {
  static app: Application;
  static appInstance: App;
}

beforeAll(async () => {
  const appInstance = new App();
  await appInstance.connectDatabase();
  global.appInstance = appInstance;
  global.app = appInstance.getApp();
});

afterAll(async () => {
  global.appInstance.disconnectDatabase();
  RedisClient.getInstance().disconnect();
});
beforeEach(async () => {});

export { global };

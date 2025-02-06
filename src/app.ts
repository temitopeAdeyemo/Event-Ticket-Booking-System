import 'newrelic';
import 'reflect-metadata';
import { AuthMiddleware } from './shared/middlewares/AuthMiddleware';
import express from 'express';
import routes from './routes';
import { ErrorHandler } from './shared/middlewares/ErrorHandler';
import { ResponseCaptureMiddleware } from './shared/middlewares/ResponseInterceptor';
import { MorganConfig as Morgan } from './shared/middlewares/MorganConfig';
import { ResourceNotFound } from './shared/middlewares/ResourceNotFound';
import { RateLimiter } from './shared/middlewares/RateLimiter';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, PORT } from './config';
import { Log } from './shared/utils/Log';
import { connectDb } from './config/Database.config';
import { Seedings } from './config/Seeding';

export default class App {
  app: express.Application;
  constructor() {
    this.app = express();
    require('../config/database.config');
    require('../shared/services/Redis');

    this.app.use(express.json());

    this.app.use(ResponseCaptureMiddleware.responseInterceptor);
    this.app.use(AuthMiddleware.requestContextMiddleware);
    this.app.use(Morgan.httpRequestLogger);
    this.app.use(Morgan.requestSummaryMiddleware);
    this.app.use(RateLimiter.init);

    this.createSuperAdmin();
    this.setRoutes();
    this.app.use(ErrorHandler.init);
    this.app.all('*', ResourceNotFound.init);
  }

  async createSuperAdmin() {
    await Seedings.exec();
  }

  setRoutes() {
    this.app.use('/api/v1', routes);
  }

  getApp() {
    return this.app;
  }

  listen() {
    this.app
      .listen(PORT, async () => {
        await connectDb();
        Log.info(`✓ 👍 Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
        Log.info(
          `A default user has been created for testing purposes. \nEmail: ${DEFAULT_USER_EMAIL}\nPassword: ${DEFAULT_USER_PASSWORD}`
        );
      })
      .on('error', (err) => {
        Log.error('Failed to listen', err.message);
        process.exit(1);
      });
  }
}

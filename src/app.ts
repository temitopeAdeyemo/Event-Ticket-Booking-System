import 'newrelic';
import 'reflect-metadata';
import { AuthMiddleware } from './shared/middlewares/AuthMiddleware';
import express from 'express';
import routes from './modules';
import { ErrorHandler } from './shared/middlewares/ErrorHandler';
import { ResponseCaptureMiddleware } from './shared/middlewares/ResponseInterceptor';
import { MorganConfig as Morgan } from './shared/middlewares/MorganConfig';
import { ResourceNotFound } from './shared/middlewares/ResourceNotFound';
import { RateLimiter } from './shared/middlewares/RateLimiter';
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD, PORT } from './config';
import { Log } from './shared/utils/Log';
import { DataBase } from './config/Database.config';
import { Seedings } from './config/Seeding';
import { container } from 'tsyringe';

export default class App {
  public app: express.Application;
  private accessToken: string;

  constructor() {
    this.app = express();

    this.app.use(express.json());

    this.app.use(RateLimiter.init);
    this.app.use(AuthMiddleware.requestContextMiddleware);
    this.app.use(Morgan.httpRequestLogger);
    this.app.use(ResponseCaptureMiddleware.responseInterceptor);
    this.app.use(Morgan.requestSummaryMiddleware);

    // this.app.use(ResponseCaptureMiddleware.responseInterceptor);
    // this.app.use(AuthMiddleware.requestContextMiddleware);
    // this.app.use(Morgan.httpRequestLogger);
    // this.app.use(Morgan.requestSummaryMiddleware);
    // this.app.use(RateLimiter.init);

    this.setRoutes();

    this.app.all('*', ResourceNotFound.init);
    this.app.use(ErrorHandler.init);
  }

  async createSuperAdmin() {
    this.accessToken = (await container.resolve(Seedings).exec()).accessToken;
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
        await DataBase.connectDb();
        await this.createSuperAdmin().then(() => {
          Log.info(`👍 Server running on ${process.env.NODE_ENV} mode on port ${PORT}`);
          Log.info(
            `A default user and access token has been generated for testing purposes. \nEmail: ${DEFAULT_USER_EMAIL}\nPassword: ${DEFAULT_USER_PASSWORD}\naccess_token: ${this.accessToken}`
          );
        });
      })
      .on('error', (err) => {
        Log.error('Failed to listen', err.message);
        process.exit(1);
      });
  }
}

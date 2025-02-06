import 'newrelic';
import 'reflect-metadata';
import { AuthMiddleware } from './shared/middlewares/AuthMiddleware';
import express, { Application } from 'express';
import routes from './routes';
import { ErrorHandler } from './shared/middlewares/ErrorHandler';
import { ResponseCaptureMiddleware } from './shared/middlewares/ResponseInterceptor';
import { MorganConfig as Morgan } from './shared/middlewares/MorganConfig';
import { ResourceNotFound } from './shared/middlewares/ResourceNotFound';
import { RateLimiter } from './shared/middlewares/RateLimiter';

const app: Application = express();

// Middleware setup
app.use(express.json());
app.use(ResponseCaptureMiddleware.responseInterceptor);
app.use(AuthMiddleware.requestContextMiddleware);
app.use(Morgan.httpRequestLogger);
app.use(Morgan.requestSummaryMiddleware);
app.use(RateLimiter.init);

// Register routes
app.use('/api/v1', routes);

app.all('*', ResourceNotFound.init);

app.use(ErrorHandler.init);

export default app;

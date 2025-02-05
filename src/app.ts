import 'newrelic';
import { AuthMiddleware } from './shared/middlewares/authMiddleware';
import express, { Application } from 'express';
import routes from './routes';
import AppError from './shared/utils/appError';
import rateLimiter from './shared/middlewares/rateLimiter';
import errorHandler from './shared/middlewares/errorHandler';
import { ResponseCaptureMiddleware } from './shared/middlewares/ResponseInterceptor';
import { Morgan } from './shared/middlewares/morganConfig';

const app: Application = express();

// Middleware setup
app.use(express.json());
app.use(ResponseCaptureMiddleware.responseInterceptor);
app.use(AuthMiddleware.requestContextMiddleware);
app.use(Morgan.httpRequestLogger);
app.use(Morgan.requestSummaryMiddleware);
app.use(rateLimiter);

// Register routes
app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
  throw new AppError('This url is not registered on the api', 404);
});

app.use(errorHandler);

export default app;

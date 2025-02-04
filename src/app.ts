import { AuthMiddleware } from './shared/middlewares/authMiddleware';
import express, { Application } from 'express';
import routes from './routes';
// import moment from 'moment-timezone';
import morgan from 'morgan';
import AppError from './shared/utils/appError';
import rateLimiter from './shared/middlewares/rateLimiter';
import errorHandler from './shared/errorHandler';
import { ResponseCaptureMiddleware } from './shared/middlewares/ResponseInterceptor';
import { Morgan } from './shared/middlewares/morganConfig';

const app: Application = express();

// Middleware setup
app.use(express.json());
app.use(ResponseCaptureMiddleware.responseInterceptor);
app.use(AuthMiddleware.requestContextMiddleware);

// check if Auth header is passed, if so signs it.

app.use(Morgan.httpRequestLogger);
// morgan.token('utc-date', () => {
//   return new Date().toISOString();  // Logs the time in UTC
// });
// morgan.token('nigeria-time', () => {
//   return moment().tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss'); // Nigeria's timezone (WAT)
// });
// app.use(Morgan.requestInfo);
app.use(morgan(':nigeria-time - :method :url :status :res[content-length] - :response-time ms :user-agent'));
// app.use(morgan(":date[iso] - :method :url :status :res[content-length] - :response-time ms :user-agent"))
app.use(rateLimiter);

// Register routes
app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
  throw new AppError('This url is not registered on the api', 404);
});

app.use(errorHandler);

export default app;

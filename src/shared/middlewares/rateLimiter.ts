import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '../utils/appError';
import JwtClient from '../services/JWT';
import Redis from 'ioredis';
import { HttpStatusCodes } from '../utils/HttpStatusCodes';
import { Logger } from '../utils/logger';
import { NODE_ENV, redisHost, redisPassword, redisPort } from '../../config/initEnv';

const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  connectionName: 'REDIS_RATE_LIMITER',
  connectTimeout: 30 * 1000,
  name: 'REDIS_RATE_LIMITER',
});

redisClient.on('end', () => {
  if (NODE_ENV != 'test') Logger.error('Redis ended');
});

redisClient.on('error', () => {
  if (NODE_ENV != 'test') Logger.error('Redis Error');
});

redisClient.on('SIGINT', () => {
  if (NODE_ENV != 'test') Logger.info('SIGINT ERR');
});


export default async function rateLimiter(request: Request, response: Response, next: NextFunction): Promise<void> {
  let key: any;
  let controlledPath = ['/book', '/cancelled'];
  let user;

  if (request.headers['authorization'] && request.headers['authorization'].split(' ')[1]) {
    const jwtClient = new JwtClient();

    let token = request.headers['authorization'].split(' ')[1];
    try {
      user = jwtClient.verifyAccessToken(token);
      key = user.email;
    } catch (error: any) {
      Logger.warn(
        `ERROR: ${
          error.message || 'Invalid session id.'
        } on path: ' + request.path + ' from: user with invalid or expired JWT. Please try again later.`
      );
      return next(new AppError(error.message || 'Invalid session id.', HttpStatusCodes.FORBIDDEN));
    }
    request.currentUser = { id: user.user_id, email: user.email };
  }
  try {
    const limiter = new RateLimiterRedis({
      points: NODE_ENV == 'test' ? 50 : 5,
      duration: 5,
      storeClient: redisClient,
    });

    key = key || request.ip;

    for (let path of controlledPath) {
      if (request.path.includes(path)) {
        Logger.info('HITTING CONTROLLED ENDPOINT...');
        limiter.points = NODE_ENV == 'test' ? 500 : 1;
        limiter.duration = 10;

        await limiter.consume(`trans-${path}-${key}`);

        return next();
      }
    }

    await limiter.consume(`trans-${key}`);
    return next();
  } catch (error) {
    console.log(error);

    if (request.headers['authorization'] && request.headers['authorization'].split(' ')[1]) {
      Logger.warn('WARNING: Too many requests on path: ' + request.path + ' from: ' + user.email + '. Please try again later.');
      return next(new AppError(`System busy, Try again in a moment.`, HttpStatusCodes.TOO_MANY_REQUESTS));
    }
    Logger.warn('WARNING: Too many requests on path: ' + request.path + ' from: user with NO JWT. Please try again later.');
    return next(new AppError(`System busy, Try again in a moment.`, HttpStatusCodes.TOO_MANY_REQUESTS));
  }
}

export { redisClient };

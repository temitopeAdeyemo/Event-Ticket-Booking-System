import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '../utils/AppError';
import JwtClient from '../services/JwtClient';
import { HttpStatusCodes } from '../utils/HttpStatusCodes';
import { Log } from '../utils/Log';
import { NODE_ENV } from '../../config';
import RedisClient from '../services/RedisClient';

export class RateLimiter {
  public static redisClient = RedisClient.getInstance();
  public static duration = 0;
  static async init(request: Request, response: Response, next: NextFunction): Promise<void> {
    let key: any;
    // let controlledPath: string[] = ['/book', '/cancel'];
    let controlledPath: string[] = [];
    let user;

    if (request.headers['authorization'] && request.headers['authorization'].split(' ')[1]) {
      const jwtClient = new JwtClient();

      let token = request.headers['authorization'].split(' ')[1];
      try {
        user = jwtClient.verifyAccessToken(token);
        key = user.email;
      } catch (error: any) {
        Log.warn(
          `ERROR: ${error.message || 'Invalid session id.'} on path: ${
            request.path
          }from user with invalid or expired JWT.`
        );
        return next(new AppError(error.message || 'Invalid session id.', HttpStatusCodes.FORBIDDEN));
      }
    }
    try {
      let duration = 5;
      const limiter = new RateLimiterRedis({
        points: NODE_ENV == 'test' ? 5000 : 200,
        duration,
        storeClient: RateLimiter.redisClient,
      });
      RateLimiter.duration = duration;

      key = key || request.ip;

      for (let path of controlledPath) {
        if (request.path.includes(path)) {
          Log.info('HITTING CONTROLLED ENDPOINT...');
          limiter.points = NODE_ENV == 'test' ? 500 : 1;
          limiter.duration = 1;

          RateLimiter.duration = limiter.duration;

          await limiter.consume(`trans-${path}-${key}`);

          return next();
        }
      }

      await limiter.consume(`trans-${key}`);
      return next();
    } catch (error) {
      if (request.headers['authorization'] && request.headers['authorization'].split(' ')[1]) {
        Log.warn('WARNING: Too many requests on path: ' + request.path + ' from: ' + user.email + '.');
        return next(new AppError(`Processing request, Try again in ${RateLimiter.duration}secs.`, HttpStatusCodes.TOO_MANY_REQUESTS));
      }
      Log.warn('WARNING: Too many requests on path: ' + request.path + ' from: user with NO JWT.');
      return next(new AppError(`Processing request, Try again in ${RateLimiter.duration}secs..`, HttpStatusCodes.TOO_MANY_REQUESTS));
    }
  }
}

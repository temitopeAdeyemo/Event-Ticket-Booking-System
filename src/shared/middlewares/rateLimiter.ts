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

/**
 * This function is a listener for the 'end' event of the Redis client.
 * It logs a message to the console if the application is not in test mode.
 * @param {any} - The event data, which is not used in this function.
 */
redisClient.on('end', () => {
  if (NODE_ENV != 'test') Logger.error('Redis ended');
  // if (NODE_ENV != 'test') console.error('Redis ended');
});

/**
 * This function is a listener for the 'error' event of the Redis client.
 * It logs a message to the console if the application is not in test mode.
 * @param {any} - The error event data, which is not used in this function.
 */
redisClient.on('error', () => {
  if (NODE_ENV != 'test') Logger.error('Redis Error');
  // if (NODE_ENV != 'test') console.error('Redis Error');
});

/**
 * This function is a listener for the 'SIGINT' event of the Redis client.
 * It logs a message to the console if the application is not in test mode.
 *
 * @param {any} - The event data, which is not used in this function.
 */
redisClient.on('SIGINT', () => {
  if (NODE_ENV != 'test') Logger.info('SIGINT ERR');
  // if (NODE_ENV != 'test') console.log('SIGINT ERR');
});

/**
 * This function is a middleware for rate limiting requests to the application.
 * It uses the `RateLimiterRedis` library to limit the number of requests a merchant or IP address can make within a certain time frame.
 *
 * @param {Request} request - The Express request object containing information about the incoming request.
 * @param {Response} response - The Express response object used to send HTTP responses back to the client.
 * @param {NextFunction} next - The Express next function used to pass control to the next middleware in the stack.
 *
 * @returns {Promise<void>} - A Promise that resolves when the middleware has finished processing the request.
 *
 * @throws {AppError} - If the merchant has exceeded the maximum number of requests allowed within the specified time frame, an `AppError` is thrown with a status code of 429 and a message indicating that the system is busy and the merchant should try again later.
 */
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
      Logger.warn('ERROR: Too many requests on path: ' + request.path + ' from: ' + user.email + '. Please try again later.',);
      return next(new AppError(`System busy, Try again in a moment.`, HttpStatusCodes.TOO_MANY_REQUESTS));
    }
    Logger.warn('ERROR: Too many requests on path: ' + request.path + ' from: user with NO JWT. Please try again later.');
    return next(new AppError(`System busy, Try again in a moment.`, HttpStatusCodes.TOO_MANY_REQUESTS));
  }
}

export { redisClient };

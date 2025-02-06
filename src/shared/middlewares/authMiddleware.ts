import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';
import JwtClient from '../services/JWT';
import { ContextHolder } from '../utils/ContextHolder';
import { AuthUserPayload } from '../types/express';
import { Log } from '../utils/Log';

export class AuthMiddleware {
  static requestContextMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data: { [key: string]: any } = {};

    data['req_method'] = req.method;
    data['url'] = req.url;

    ContextHolder.setContext(data);

    if (!req.headers.authorization) {
      this.logRequestInitializationTime();
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    let isAuthenticated;
    try {
      isAuthenticated = new JwtClient().verifyAccessToken(token) as AuthUserPayload;
    } catch (error) {
      ContextHolder.setContext({ user: { token } });
      this.logRequestInitializationTime();
      throw error;
    }

    req.currentUser = isAuthenticated;

    let user: any = { ...req.currentUser };

    delete user.iat;
    delete user.exp;

    ContextHolder.setContext({ user });
    this.logRequestInitializationTime();

    next();
  });

  static requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) throw new AppError('Session expired. Please login again.', 401);
    next();
  });

  private static logRequestInitializationTime = () => {
    return Log.info(`Request processing started.`);
  };
}

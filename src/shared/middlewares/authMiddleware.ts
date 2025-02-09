import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../utils/AppError';
import JwtClient from '../services/JwtClient';
import { ContextHolder } from '../utils/ContextHolder';
import { AuthUserPayload } from '../types/express';
import { Log } from '../utils/Log';
import { GetUserService } from '../../modules/auth/services';
import { container } from 'tsyringe';
import { HttpStatusCodes } from '../utils/HttpStatusCodes';

export class AuthMiddleware {
  static requestContextMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data: { [key: string]: any } = {};

    data.req_method = req.method;
    data.url = req.url;

    ContextHolder.setContext(data);

    if (!req.headers.authorization) {
      ContextHolder.setContext({ user: { email: req.body.email || req.query.email || req.headers.email } });
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
      throw new AppError('Authentication Failed.', HttpStatusCodes.FORBIDDEN);
    }

    container.resolve(GetUserService).findOne({ id: isAuthenticated.id });

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

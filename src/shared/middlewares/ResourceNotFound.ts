import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

export class ResourceNotFound {
  static init = (req: Request, res: Response, next: NextFunction) => {
    throw new AppError('This url is not registered on the api', 404);
  };
}

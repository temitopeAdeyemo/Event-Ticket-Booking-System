import { Request, Response, NextFunction } from 'express';
import { CelebrateError } from 'celebrate';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Log } from '../utils/Log';
import AppError from '../utils/AppError';
import { HttpStatusCodes } from '../utils/HttpStatusCodes';
import { NODE_ENV } from '../../config';
import { ResponseHandler } from '../utils/ResponseHandler';
const { sendFailedResponse } = ResponseHandler;

export class ErrorHandler {
  static init(error: Error, request: Request, response: Response, _: NextFunction) {
    console.log(error); // Do not remove.
    Log.error(error);

    let statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const errorStack = NODE_ENV == 'development' ? error.stack : null;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      message = error.message;
    } else if (error instanceof JsonWebTokenError) {
      statusCode = HttpStatusCodes.UNAUTHORIZED;
      message = 'Token invalid';
    } else if (error instanceof CelebrateError) {
      const _ = ['body', 'query', 'params', 'headers'];
      message = _.map((key) => error.details.get(key)?.message).find((msg) => msg) || 'Validation error';
      statusCode = HttpStatusCodes.BAD_REQUEST;
    }

    sendFailedResponse(response, statusCode, message, null, errorStack);
  }
}

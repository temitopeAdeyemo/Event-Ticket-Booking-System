import { Response } from 'express';

export class ResponseHandler {
  static sendSuccessResponse = (res: Response, code: number, msg?: string, data?: { [key: string]: any } | null,) => {
    const responsePayload = {
      success: true,
      message: msg || 'Success.',
      data,
    };

    return res.status(code).json(responsePayload);
  };

  static sendFailedResponse = (res: Response, code: number, msg?: string, data?: { [key: string]: any } | null, stack?: any) => {
    const responsePayload: { [key: string]: any } = {
      success: false,
      message: msg || 'Failed.',
      data,
    };

    if (stack) responsePayload.stack = stack;

    return res.status(code).json(responsePayload);
  };
}

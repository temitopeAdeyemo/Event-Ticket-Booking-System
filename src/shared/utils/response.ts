import { Response } from 'express';

export const sendSuccess = (res: Response, code: number, msg?: string, data?: { [key: string]: any } | null) => {
  return res.status(code).json({
    success: true,
    message: msg || 'done',
    data: data,
  });
};

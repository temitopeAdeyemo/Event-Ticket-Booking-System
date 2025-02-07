import { Request, Response } from 'express';
import morgan from 'morgan';
import { ContextHolder } from '../utils/ContextHolder';
import { GENERAL_NS } from '../../config';
import { Log } from '../utils/Log';
import moment from 'moment-timezone';
import { getCurrentTime } from '../utils';

export class MorganConfig {
  static {
    type MorganRequest = Request & { _startTime?: Date };

    morgan.token('processing-time', (req: MorganRequest, res: Response): string => {
      return req._startTime ? `${new Date().getTime() - req._startTime.getTime()}ms` : '0ms';
    });

    morgan.token('response-body', (req: Request, res: Response): string => (res.locals.responseBody ? res.locals.responseBody : '{}'));

    morgan.token('nigeria-time', () => getCurrentTime());

    morgan.token('nigeria-time', () => {
      return moment().tz('Africa/Lagos').format('YYYY-MM-DD HH:mm:ss');
    });
  }
  static httpRequestLogger = morgan(
    (tokens, req: Request, res: Response) => {
      const nigeriaTime = tokens['nigeria-time'](req, res);
      const method = tokens.method(req, res);
      const url = tokens.url(req, res);
      const status = tokens.status(req, res);
      const contentLength = tokens.res(req, res, 'content-length');
      const responseTime = tokens['response-time'](req, res);
      const userAgent = tokens['user-agent'](req, res);

      return JSON.stringify({
        request_info: `${nigeriaTime} - ${method} ${url} ${status} ${contentLength} - ${responseTime} ms ${userAgent}`,
        request_body: JSON.stringify(req.body),
        response_data: tokens['response-body'](req, res),
        header: JSON.stringify(req.headers),
      });
    },
    {
      stream: {
        write: (message) => {
          const data = JSON.parse(message);
          const context = ContextHolder.getContext();
          
          const ns = context?.user?.email || GENERAL_NS;
          Log.systemLog(ns).http(`${getCurrentTime()}|request-info`, data);
        },
      },
    }
  );

  static requestSummaryMiddleware = morgan('[INFO MESSAGE]| :nigeria-time - :method :url :status :res[content-length] - :response-time ms :user-agent');
}

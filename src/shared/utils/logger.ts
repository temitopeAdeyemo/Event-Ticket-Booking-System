import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { getCurrentTime, getFormattedDate } from '.';
import { ContextHolder } from './ContextHolder';
import { GENERAL_NS } from '../../config/initEnv';

const { combine, timestamp, prettyPrint } = format;

export class Logger {
  private static setFileRotationTransport(subPath?: string) {
    const path = subPath ? `logs/${getFormattedDate()}/${subPath}/combined-%DATE%.log` : 'logs/combined-%DATE%.log';

    return new transports.DailyRotateFile({
      filename: path,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d',
    });
  }

  private static setDefaultMeta() {
    const context: any = ContextHolder.getContext();
    const data: any = { data: null };

    if (context) {
      data.data = `METHOD: ${context.req_method}, URL: ${context.url}, USER_DATA: ${context.user ? JSON.stringify(context.user) : null}`;
    }

    return data;
  }

  public static systemLog(subPath = '') {
    const logger = createLogger({
      defaultMeta: Logger.setDefaultMeta(),
      level: 'http',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }), prettyPrint()),
      transports: [
        Logger.setFileRotationTransport(subPath),
        new transports.File({
          filename: subPath ? `logs/${getFormattedDate()}/${subPath}/error.log` : `logs/${getFormattedDate()}/error.log`,
          level: 'error',
        }),
      ],
    });

    logger.exceptions.handle(
      new transports.File({
        filename: `logs/${getFormattedDate()}/${subPath}/exceptions.log`,
      })
    );

    logger.rejections.handle(
      new transports.File({
        filename: `logs/${getFormattedDate()}/${subPath}/rejections.log`,
      })
    );

    return logger;
  }

  public static info(message: any) {
    console.log('INFO MESSAGE: ', message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).info(`${getCurrentTime()}|${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${message}`);
  }

  public static warn(message: any) {
    console.warn('WARNING MESSAGE: ', message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).warn(`${getCurrentTime()}|${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${message}`);
  }

  public static error(error: any) {
    console.error('ERROR MESSAGE: ', error.stack);
    const context = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).error(`${getCurrentTime()}|${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${error.message}`);
  }

  public static debug(message: string) {
    console.debug('DEBUG MESSAGE: ', message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).debug(message);
  }
}

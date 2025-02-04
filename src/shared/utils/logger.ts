import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { getFormattedDate } from '.';
import { ContextHolder } from './ContextHolder';
import { GENERAL_NS } from '../../config/initEnv';

const { combine, timestamp, prettyPrint } = format;
// const GENERAL_NS = 'general-log';

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
    Logger.systemLog(ns).info(`${ns ? ns + ' -> ' : ''} ${message}`);
  }

  public static warn(message: any) {
    console.log('WARNING MESSAGE: ', message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).warn(`${ns ? ns + ' -> ' : ''} ${message}`);
  }

  public static error(message: any) {
    console.log('ERROR MESSAGE: ', message);
    const context = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).error(`${ns ? ns + ' -> ' : ''} ${message}`);
  }

  public static debug(message: string) {
    console.log('DEBUG MESSAGE: ', message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Logger.systemLog(ns).debug(`${ns ? ns + ' -> ' : ''} ${message}`);
  }
}

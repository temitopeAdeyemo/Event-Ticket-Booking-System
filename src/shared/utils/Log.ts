import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { getCurrentTime, getFormattedDate } from '.';
import { ContextHolder } from './ContextHolder';
import { GENERAL_NS } from '../../config';

const { combine, timestamp, prettyPrint } = format;

export class Log {
  private static loggers = new Map<string, any>();
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
    if (this.loggers.has(subPath)) {
      return this.loggers.get(subPath);
    }

    const logger = createLogger({
      defaultMeta: Log.setDefaultMeta(),
      level: 'http',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }), prettyPrint()),
      transports: [
        Log.setFileRotationTransport(subPath),
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

    this.loggers.set(subPath, logger);

    return logger;
  }

  public static info(message: any) {
    console.log(`[INFO MESSAGE] ${getCurrentTime()}`, message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Log.systemLog(ns).info(`${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${message}`);
  }

  public static warn(message: any) {
    console.warn(`[WARNING MESSAGE] ${getCurrentTime()}`, message);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Log.systemLog(ns).warn(`${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${message}`);
  }

  public static error(...errors: any) {
    errors = errors.map((error: any) => error?.message || error);
    console.error(`[ERROR MESSAGE] ${getCurrentTime()}`, errors.join(''));
    const context = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Log.systemLog(ns).error(`${ns && ns != GENERAL_NS ? ns + ' -> ' : ''}${errors.join(', ')}`);
  }

  public static debug(err: any) {
    console.debug(`[DEBUG MESSAGE] ${getCurrentTime()}`, err.stack || err);
    const context: any = ContextHolder.getContext();
    const ns = context?.user?.email || context?.user?.token || GENERAL_NS;
    Log.systemLog(ns).debug(err);
  }
}

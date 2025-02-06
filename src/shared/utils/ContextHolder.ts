import { AsyncLocalStorage } from 'async_hooks';
import AppError from './AppError';
import { HttpStatusCodes } from './HttpStatusCodes';

export class ContextHolder {
  private static asyncLocalStorage = new AsyncLocalStorage();

  public static setContext = (data: { [key: string]: any }) => {
    if (typeof data !== 'object') throw new AppError('INTERNAL SERVER ERROR', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    const contextData = this.asyncLocalStorage.getStore();

    if (contextData) return this.asyncLocalStorage.enterWith({ ...contextData, ...data });

    return this.asyncLocalStorage.enterWith(data);
  };

  public static getContext = () => {
    return this.asyncLocalStorage.getStore() as { [key: string]: any };
  };
}

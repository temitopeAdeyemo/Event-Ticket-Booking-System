import { QueryRunner } from 'typeorm';
import { DataBase } from '../../config/Database.config';
import AppError from './AppError';
import { HttpStatusCodes } from './HttpStatusCodes';

export class TransactionUtil {
  public static transactional = async <T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T> => {
    const queryRunner = await DataBase.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new AppError('Error occurred.', HttpStatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  };
}

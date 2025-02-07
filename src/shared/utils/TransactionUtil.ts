import { database } from '../../config/Database.config';
import { QueryRunner } from 'typeorm';
import { Log } from './Log';

export class TransactionUtil {
  public static transactional = async <T>(operation: (queryRunner: QueryRunner) => Promise<T>): Promise<T> => {
    const queryRunner = await database.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner
        .release()
        .then(() => {
          Log.info('Transaction Released.');
        })
        .catch((error) => {
          Log.error('******************************** UNABLE TO RELEASE', error?.message);
        });
    }
  };
}

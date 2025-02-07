import { DataSource, QueryRunner } from 'typeorm';
import { DB_APPLICATION_NAME, DB_URL, DB_SYNC, DB_LOGGING } from './index';
import { Log } from '../shared/utils/Log';

export class DataBase {
  public static AppDataSource: DataSource;

  static {
    DataBase.AppDataSource = new DataSource({
      type: 'postgres',
      url: DB_URL,
      synchronize: DB_SYNC,
      logging: DB_LOGGING,
      migrationsRun: true,
      entities: ['./dist/modules/**/models/entity/*.js'],
      migrations: ['./src/shared/migrations/*.ts'],
      applicationName: DB_APPLICATION_NAME,
    });
  }
  static connectDb = async () => {
    try {
      await DataBase.AppDataSource.initialize();
      Log.info('Connected to database...');
    } catch (err: any) {
      Log.error('Something went wrong when connecting to the database:\n', err.stack);
    }
  };

  public static async startTransaction(): Promise<QueryRunner> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    } catch (error) {
      await queryRunner.release();
      throw error;
    }
  }
}

export const AppDataSource = DataBase.AppDataSource;

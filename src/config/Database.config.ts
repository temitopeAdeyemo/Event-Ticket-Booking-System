import { DataSource, QueryRunner } from 'typeorm';
import { DB_APPLICATION_NAME, DB_URL, DB_SYNC, DB_LOGGING, POOL_SIZE } from './index';
import { Log } from '../shared/utils/Log';

class Database {
  public AppDataSource: DataSource;

  constructor() {
    this.AppDataSource = new DataSource({
      type: 'postgres',
      url: DB_URL,
      synchronize: DB_SYNC,
      logging: DB_LOGGING,
      migrationsRun: true,
      poolSize: POOL_SIZE,
      entities: ['./dist/modules/**/models/entity/*.js'],
      migrations: ['./src/shared/migrations/*.ts'],
      applicationName: DB_APPLICATION_NAME,
    });
  }

  public connectDb = async () => {
    try {
      await this.AppDataSource.initialize();
      Log.info('Connected to database...');
    } catch (err: any) {
      Log.error('Something went wrong when connecting to the database:\n', err.stack);
    }
  };

  public async startTransaction(): Promise<QueryRunner> {
    const queryRunner = this.AppDataSource.createQueryRunner();
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

export const database = new Database();
export const AppDataSource = database.AppDataSource;

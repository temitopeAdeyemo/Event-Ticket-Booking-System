import { DataSource, QueryRunner } from 'typeorm';
import { DB_APPLICATION_NAME, DB_URL, DB_SYNC, DB_LOGGING, NODE_ENV } from './index';
console.log(NODE_ENV, "--->", DB_URL);
const AppDataSource = new DataSource({
  type: 'postgres',
  // url: 'postgres://postgres:123456789@localhost:5432/customerdb',
  url: DB_URL,
  synchronize: DB_SYNC,
  logging: DB_LOGGING,
  migrationsRun: true,
  entities: ['./dist/modules/**/models/entities/*.js'],
  migrations: ['./src/shared/migrations/*.ts'],
  applicationName: DB_APPLICATION_NAME,
  poolSize: 30
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database...');
  } catch (err: any) {
    console.error('Something went wrong when connecting to the database:\n', err.stack);
  }
})();

export const startTransaction = async (): Promise<QueryRunner> => {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  } catch (error) {
    await queryRunner.release();
    throw error;
  }
};

export default AppDataSource;

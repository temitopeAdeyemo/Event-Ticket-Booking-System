import { DataSource } from 'typeorm';
import { DB_APPLICATION_NAME, DB_URL, DB_SYNC, DB_LOGGING } from './index';
import { Log } from '../shared/utils/Log';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  synchronize: DB_SYNC,
  logging: DB_LOGGING,
  migrationsRun: true,
  entities: ['./dist/modules/**/models/entities/*.js'],
  migrations: ['./src/shared/migrations/*.ts'],
  applicationName: DB_APPLICATION_NAME,
});

export const connectDb = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Connected to database...');
  } catch (err: any) {
    Log.error('Something went wrong when connecting to the database:\n', err.stack);
  }
};

export default AppDataSource;

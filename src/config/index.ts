import dotenv from 'dotenv';
import { Log } from '../shared/utils/Log';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DB_URL = NODE_ENV == 'development' ? process.env.DB_URL_DEV : process.env.DB_URL;
export const PORT = process.env.PORT || 3000;
export const JWT_KEY = process.env.JWT_KEY || 'somekey';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const port = process.env.PORT || 50051;
export const saltRounds = process.env.SALT_ROUNDS || 10;
export const jwtAccessTokenSecret =
  process.env.JWT_ACCESS_TOKEN_SECRET || '03afc0820d376f9fdb1e8fadfefw3902c6f74705feb01f101c480f4205964e3e10';
export const jwtRefreshTokenSecret =
  process.env.JWT_REFRESH_TOKEN_SECRET || '7bfd6e6512e8ac8b56e31cfbdbe76789efe075039d4a524b2b2ddcb2fb2c69f';
export const redisHost = process.env.REDIS_HOST || 'localhost';
export const redisPort = Number(process.env.REDIS_PORT) || 6379;
export const redisPassword = process.env.REDIS_PASSWORD || 'default';
export const MAX_LOGIN_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5');
export const LOGIN_ATTEMPT_EXPIRY = parseInt(process.env.LOGIN_ATTEMPT_EXPIRY || '2');
export const GENERAL_NS = process.env.GENERAL_NS || 'general-log';
export const NEW_RELIC_APP_NAME = process.env.NEW_RELIC_APP_NAME;
export const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY;
export const DB_APPLICATION_NAME = process.env.DB_APPLICATION_NAME;
export const DB_SYNC = process.env.DB_SYNC == 'true';
export const DB_LOGGING = process.env.DB_LOGGING == 'true';

const requiredEnvVariables = ['DB_URL', 'PORT', 'NODE_ENV', 'JWT_EXPIRES_IN', 'NEW_RELIC_APP_NAME', 'NEW_RELIC_LICENSE_KEY'];

// Load environment variables from the .env file
const loadEnvVariables = (): void => {
  const result = dotenv.config();

  if (result.error) {
    console.error('Error loading environment variables from .env file');
    process.exit(1);
  }

  // Check if each required environment variable is set
  requiredEnvVariables.forEach((envVar) => {
    const value = process.env[envVar];
    if (!value) {
      console.error(`Please set ${envVar} in the env file.`);
      process.exit(1);
    }
  });

  Log.info('All required environment variables are set successfully.');
};

export default loadEnvVariables;

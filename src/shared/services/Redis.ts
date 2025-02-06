import Redis from 'ioredis';
import { redisHost, redisPassword, redisPort } from '../../config';
import { Log } from '../utils/Log';

class RedisClient {
  private static instance: Redis | null = null;
  static setInstance() {
    this.instance = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      connectionName: 'DEFAULT_CONNECTION',
      connectTimeout: 30 * 1000,
      name: 'DEFAULT_CONNECTION',
    });

    this.instance.on('connect', () => Log.info('Redis connected'));
    this.instance.on('ready', () => Log.info('Redis ready for connection'));
    this.instance.on('end', () => Log.info('Redis connection ended'));
    this.instance.on('error', (error) => {
      Log.error('Redis Error: ' + error.message);
      process.exit(0);
    });
    this.instance.on('SIGINT', () => Log.info('SIGINT ERR'));
  }

  public static getInstance(): Redis {
    if (!this.instance) this.setInstance();

    return this.instance!;
  }
}

export default RedisClient;

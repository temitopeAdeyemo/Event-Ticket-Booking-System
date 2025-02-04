import Redis from 'ioredis';
import { redisHost, redisPassword, redisPort } from '../../config/initEnv';
import { Logger } from '../utils/logger';

class CacheClient {
  client: Redis = this.init();

  init() {
    const client = new Redis({
      host: redisHost,
      port: redisPort,
      password:redisPassword,
      connectionName: 'REDIS_CACHE',
      connectTimeout: 30 * 1000,
      name: 'REDIS_CACHE',
    });

    client.on('connect', () => {
      Logger.info('Redis connected');
    });
    client.on('ready', () => {
      Logger.info('Redis ready for connection');
    });
    client.on('end', () => {
      Logger.info('Redis connection ended');
    });
    client.on('error', (error) => {
      console.log("...............|||.................");
      Logger.error('Redis Error'+ error.message);
    });
    client.on('SIGINT', () => {
      Logger.info('SIGINT ERR');
    });

    return client
  }

  getClient(){
    return this.client;
  }

  set(key: string, value: any, expiry = 72 * 60 * 60) {
    this.client.set(key, JSON.stringify(value), 'EX', expiry);
  }

  async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  delete(key: string) {
    this.client.del(key);
  }
}

export default new CacheClient();
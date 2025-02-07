import Redis from 'ioredis';
import RedisClient from '../services/RedisClient';

class Cache {
  private client: Redis;

  constructor() {
    this.client = RedisClient.getInstance();
  }

  public set(key: string, value: any, expiry = 72 * 60 * 60) {
    this.client.set(key, JSON.stringify(value), 'EX', expiry);
  }

  public async get(key: string) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  public delete(key: string) {
    this.client.del(key);
  }
}

export default new Cache();

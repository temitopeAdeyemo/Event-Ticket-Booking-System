import Redis from "ioredis";
import RedisClient from "../services/Redis";

class CacheClient {
  private client: Redis;

  constructor() {
    // Get the shared Redis connection, but use a specific client name for caching
    this.client = RedisClient.getInstance();
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

import { Redis } from 'ioredis';
import { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

export default class HackerNewsCache {
  constructor(private redis: Redis) {}

  async getHackerNewsSearchResult(query: string): Promise<HackerNewsSearchResult | null> {
    const key = `search:${query.toLowerCase()}`;
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached) as HackerNewsSearchResult;
    }
    return null;
  }

  async setHackerNewsSearchResult(query: string, result: HackerNewsSearchResult): Promise<void> {
    const key = `search:${query.toLowerCase()}`;
    await this.redis.set(key, JSON.stringify(result), 'EX', 300);
  }
}

export { HackerNewsCache };

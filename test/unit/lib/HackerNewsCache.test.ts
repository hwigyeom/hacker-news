import { Redis } from 'ioredis';

import HackerNewsCache from '@src/lib/HackerNewsCache';

import { NodeJSQueriedResults } from './resources/hackerNewsResources';

jest.mock('ioredis');

describe('Get and set HackerNews items to the Redis cache.', () => {
  let redis: jest.Mocked<Redis>;

  beforeEach(() => {
    redis = new Redis() as jest.Mocked<Redis>;
  });

  it('should return null when HackerNewsCache has no cached data.', async () => {
    // given
    redis.get.mockResolvedValueOnce(null);
    const cache = new HackerNewsCache(redis);

    // when
    const result = await cache.getHackerNewsSearchResult('node.js');

    // then
    expect(result).toBeNull();

    // redis.get()이 정확한 키로 호출되었는지 확인한다.
    expect(redis.get).toHaveBeenCalledWith('search:node.js');
  });

  it('should return cached data when HackerNewsCache has cached data.', async () => {
    // given
    const dummyData = NodeJSQueriedResults;
    redis.get.mockResolvedValueOnce(JSON.stringify(dummyData));
    const cache = new HackerNewsCache(redis);

    // when
    const result = await cache.getHackerNewsSearchResult('node.js');

    // then
    expect(result).toEqual(dummyData);
  });

  it('should set data to the HackerNews cache.', async () => {
    // given
    const dummyData = NodeJSQueriedResults;
    redis.set.mockResolvedValueOnce('OK');
    const cache = new HackerNewsCache(redis);

    // when
    await cache.setHackerNewsSearchResult('node.js', dummyData);

    // then
    expect(redis.set).toHaveBeenCalledWith('search:node.js', JSON.stringify(dummyData), 'EX', 300);
  });
});

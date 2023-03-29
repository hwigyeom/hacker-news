import axios from 'axios';

import searchHackerNews, { BASE_URL, HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

import { NodeJSQueriedResults } from '../../resources/hackerNewsResources';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('Call HackerNews search api', () => {
  it('should return normal results for node.js query.', async () => {
    // given

    // axios 호출에 대한 mock-up을 만든다.
    const mockData: HackerNewsSearchResult = NodeJSQueriedResults;
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    // when
    const result = await searchHackerNews('node.js');

    // then
    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}?query=node.js&tags=story&hitsPerPage=90`);
    expect(result).toEqual(mockData);
  });

  it('should throw error when axios call fails.', async () => {
    // given
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    // when
    try {
      await searchHackerNews('error');
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).toEqual('Network Error');
    }
  });
});

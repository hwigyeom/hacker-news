import axios from 'axios';
import type { Logger } from 'pino';

export const BASE_URL = 'https://hn.algolia.com/api/v1/search';

/**
 * Hacker News의 검색 결과를 나타내는 타입
 */
export type HackerNewsSearchResult = {
  hits: HackerNewsItem[];
  page: number;
  nbHits: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  query: string;
  params: string;
} & Record<string, unknown>;

/**
 * Hacker News의 뉴스 아이템을 나타내는 타입
 */
export type HackerNewsItem = {
  title: string;
  url: string;
  author: string;
  points: number;
  story_text: string | null;
  comment_text: string | null;
  created_at: string;
} & Record<string, unknown>;

/**
 * Hacker News의 검색 API를 호출하여 뉴스 데이터를 가져온다.
 * @param query 검색어
 * @param logger 로거
 */
export default async function searchHackerNews(query: string, logger?: Logger): Promise<HackerNewsSearchResult> {
  // host와 query를 분리하여 url을 만든다.
  const url = new URL(BASE_URL);
  url.searchParams.append('query', query);
  url.searchParams.append('tags', 'story');
  url.searchParams.append('hitsPerPage', '90');

  try {
    // axios를 통해 API의 데이터를 가져온다.
    const response = await axios.get(url.href);
    return response.data as HackerNewsSearchResult;
  } catch (err) {
    logger?.error(err);
    throw err;
  }
}

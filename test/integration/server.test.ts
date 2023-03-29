import request from 'supertest';

import app from '@src/server';

import { NodeJSQueriedResults } from '../resources/hackerNewsResources';

jest.mock('@src/lib/hackerNewsProvider', () => {
  const originalModule = jest.requireActual('@src/lib/hackerNewsProvider');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => NodeJSQueriedResults),
  };
});

jest.mock('@src/lib/HackerNewsCache', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getHackerNewsSearchResult: jest.fn().mockResolvedValue(null),
      setHackerNewsSearchResult: jest.fn(),
    };
  });
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.status).toEqual(200);
  });
});

describe('GET /search', () => {
  it('should return 302 redirect', async () => {
    const response = await request(app).get('/search');
    expect(response.status).toEqual(302);
  });
});

describe('GET /search?q=nodejs', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/search?q=nodejs');
    expect(response.status).toEqual(200);
  });
});

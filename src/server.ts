import { type AddressInfo } from 'net';
import path from 'path';

import * as dateFns from 'date-fns';
import express, { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { pinoHttp } from 'pino-http';

import HackerNewsCache from '@src/lib/HackerNewsCache';
import searchHackerNews, { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

const app = express();
const pino = pinoHttp(process.env.NODE_ENV === 'production' ? {} : { transport: { target: 'pino-pretty' } });
const redis = new Redis();

app.use(pino);

// eslint-disable-next-line import/no-named-as-default-member
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'pug');

app.locals.dateFns = dateFns;

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Search Hacker News',
  });
});

app.get('/search', async (req, res, next) => {
  try {
    console.log('Request handled by process:', process.env.NODE_APP_INSTANCE);
    let searchQuery: string | undefined;

    if (Array.isArray(req.query.q)) {
      searchQuery = req.query.q.map((q) => q.toString()).join(' ');
    } else if (typeof req.query.q === 'string') {
      searchQuery = req.query.q;
    }

    if (!searchQuery || searchQuery.trim() === '') {
      res.redirect(302, '/');
      return;
    }

    const cache = new HackerNewsCache(redis);

    let results: HackerNewsSearchResult | null;

    results = await cache.getHackerNewsSearchResult(searchQuery);
    if (results) {
      req.log.info(`Cache hit: ${searchQuery}`);
    } else {
      req.log.info(`Cache miss: ${searchQuery}`);
      results = await searchHackerNews(searchQuery, pino.logger);
      await cache.setHackerNewsSearchResult(searchQuery, results);
    }

    res.render('search', {
      title: `Search result for: ${searchQuery}`,
      searchResults: results,
      searchQuery,
    });
  } catch (err) {
    next(err);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

app.set('views', path.join(__dirname, '..', 'views'));

const server = app.listen(process.env.PORT || 3000, () => {
  pino.logger.info(`Hacker news server started on port: ${(server.address() as AddressInfo).port}`);

  setTimeout(() => {
    process.send?.('ready');
  }, 1000);
});

function cleanupAndExit() {
  server.close(() => {
    pino.logger.info('Hacker news server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

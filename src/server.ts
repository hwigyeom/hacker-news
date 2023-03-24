import { type AddressInfo } from 'net';
import path from 'path';

import * as dateFns from 'date-fns';
import express, { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import morgan from 'morgan';
import winston from 'winston';

import HackerNewsCache from '@src/lib/HackerNewsCache';
import searchHackerNews, { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

const app = express();

/* eslint-disable import/no-named-as-default-member */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
/* eslint-enable import/no-named-as-default-member */

app.use(morgan('short', { stream: { write: (message) => logger.info(message.trim()) } }));

const redis = new Redis();

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
    process.env.NODE_APP_INSTANCE && logger.info(`Request handled by process: ${process.env.NODE_APP_INSTANCE}`);
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
      logger.info(`Cache hit: ${searchQuery}`);
    } else {
      logger.info(`Cache miss: ${searchQuery}`);
      results = await searchHackerNews(searchQuery, logger);
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
  logger.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

app.set('views', path.join(__dirname, '..', 'views'));

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`Hacker news server started on port: ${(server.address() as AddressInfo).port}`);

  setTimeout(() => {
    process.send?.('ready');
  }, 1000);
});

function cleanupAndExit() {
  server.close(() => {
    logger.info('Hacker news server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', cleanupAndExit);
process.on('SIGTERM', cleanupAndExit);

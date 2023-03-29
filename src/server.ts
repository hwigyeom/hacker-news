import { type AddressInfo } from 'net';
import path from 'path';

import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { Redis } from 'ioredis';
import { DateTime } from 'luxon';
import morgan from 'morgan';
import winston from 'winston';

import HackerNewsCache from '@src/lib/HackerNewsCache';
import searchHackerNews, { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';

dotenv.config();
dotenv.config({ path: path.join(__dirname, '..', '.env.local'), override: true });

const app = express();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.debug(`System timezone is: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

morgan.token('date', (req, res, tz?) => {
  return DateTime.now()
    .setZone(tz?.toString() || Intl.DateTimeFormat().resolvedOptions().timeZone)
    .toISO();
});

app.use(
  morgan(':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length]', {
    stream: { write: (message) => logger.http(message.trim()) },
  })
);

logger.debug(`Redis client connect to: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

// eslint-disable-next-line import/no-named-as-default-member
app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'pug');

app.locals.DateTime = DateTime;

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

const defaultPort = process.env.PORT || 3000;
const port = process.env.NODE_APP_INSTANCE
  ? Number(defaultPort) + Number(process.env.NODE_APP_INSTANCE)
  : Number(defaultPort);
const server = app.listen(port, () => {
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

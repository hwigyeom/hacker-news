import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import morgan from 'morgan';
import * as dateFns from 'date-fns';
import { type AddressInfo } from 'net';
import searchHackerNews, { HackerNewsSearchResult } from '@src/lib/hackerNewsProvider';
import Redis from 'ioredis';
import HackerNewsCache from '@src/lib/HackerNewsCache';

const app = express();
const redis = new Redis();

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => console.log(message.trim()),
  },
});

app.use(morganMiddleware);

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

    let results: HackerNewsSearchResult | null = null;

    results = await cache.getHackerNewsSearchResult(searchQuery);
    if (results) {
      console.log('Cache hit:', searchQuery);
    } else {
      console.log('Cache miss:', searchQuery);
      results = await searchHackerNews(searchQuery);
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
  console.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

app.set('views', path.join(__dirname, 'views'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Hacker news server started on port: ${(server.address() as AddressInfo).port}`);
});

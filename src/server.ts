import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import axios from 'axios';
import morgan from 'morgan';
import dateFns from 'date-fns';
import { type AddressInfo } from 'net';

const app = express();

const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => console.log(message.trim()),
  },
});

app.use(morganMiddleware);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.set('view engine', 'pug');

app.locals.dateFns = dateFns;

async function searchHN(query: string) {
  const response = await axios.get(`https://hn.algolia.com/api/v1/search?query=${query}&tags=story&hitsPerPage=90`);
  return response.data;
}

app.get('/search', async (req, res, next) => {
  try {
    let searchQuery: string | undefined;

    if (Array.isArray(req.query.q)) {
      searchQuery = req.query.q.map((q) => q.toString()).join(' ');
    } else if (typeof req.query.q === 'string') {
      searchQuery = req.query.q;
    }

    console.log('searchQuery', searchQuery);

    if (!searchQuery || searchQuery.trim() === '') {
      res.redirect(302, '/');
      return;
    }

    const results = await searchHN(searchQuery);
    console.log('results', results);
    res.render('search', {
      title: `Search result for: ${searchQuery}`,
      searchResults: results,
      searchQuery,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.set('Content-Type', 'text/html');
  res.status(500).send('<h1>Internal Server Error</h1>');
});

// app.set('views', path.join(__dirname, '..', 'views'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Hacker news server started on port: ${(server.address() as AddressInfo).port}`);
});

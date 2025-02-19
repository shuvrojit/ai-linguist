import express, { Express, Response } from 'express';
import morganMiddleware from './config/morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import v1Router from './routes/v1';
import { errorHandler, notFound } from './middleware/errorHandler';

const app: Express = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(morganMiddleware);

app.get('/', (_, res: Response) => {
  res.status(200);
  res.send('root');
});

app.use('/api', v1Router);

// Handle 404s
app.use(notFound);

// Handle all errors
app.use(errorHandler);

export default app;

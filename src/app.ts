import express, { Express, Response } from 'express';
import morganMiddleware from './config/morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { featureRouter, pageContentRouter } from './routes/v1';

const app: Express = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(morganMiddleware);

app.get('/', (_, res: Response) => {
  res.status(200);
  res.send('root');
});

app.use('/api/features', featureRouter);
app.use('/api/page-content', pageContentRouter);

export default app;

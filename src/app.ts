import express, { Express, Response } from 'express';
import morganMiddleware from './config/morgan';
import featureRouter from './routes/v1/features.routes';
import bodyParser from 'body-parser';
import cors from 'cors';

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

app.use('/api', featureRouter);

export default app;

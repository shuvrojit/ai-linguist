import { Router } from 'express';
import { summarize } from '../../controllers/features.controller';

const featureRouter = Router();

featureRouter.post('/summary', summarize);

export default featureRouter;

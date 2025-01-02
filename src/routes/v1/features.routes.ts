import { Router } from 'express';
import { summarize, overview } from '../../controllers/features.controller';

const featureRouter = Router();

featureRouter.post('/summary', summarize);
featureRouter.post('/detailed-overview', overview);

export default featureRouter;

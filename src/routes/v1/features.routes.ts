import { Router } from 'express';
import { featuresController } from '../../controllers';

const featureRouter = Router();

featureRouter.post('/summary', featuresController.summarize);
featureRouter.post('/extract', featuresController.extractText);
featureRouter.post('/detailed-overview', featuresController.overview);

export default featureRouter;

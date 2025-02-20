import { Router } from 'express';
import { featuresController } from '../../controllers';

const featureRouter = Router();

featureRouter.post('/analyze', featuresController.analyzeMeaning);
featureRouter.get('/analyze/:id', featuresController.analyzeById);

export default featureRouter;

import { Router } from 'express';
import { featuresController } from '../../controllers';

const featureRouter = Router();

featureRouter.post('/summarize', featuresController.summarize);
featureRouter.post('/analyze', featuresController.analyzeMeaning);
featureRouter.post('/analyze-by-id', featuresController.analyzeById);
featureRouter.post('/summarize-by-id', featuresController.summarizeById);

export default featureRouter;

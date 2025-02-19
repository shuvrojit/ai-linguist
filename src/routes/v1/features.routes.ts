import { Router } from 'express';
import { featuresController } from '../../controllers';

const featureRouter = Router();

featureRouter.post('/analyze', featuresController.analyzeMeaning);

export default featureRouter;

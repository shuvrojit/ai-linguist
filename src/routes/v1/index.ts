import { Router } from 'express';
import featuresRouter from './features.routes';
import pageContentRouter from './pageContent.routes';
import jobDescriptionRouter from './jobDescription.routes';

const router = Router();

router.use('/features', featuresRouter);
router.use('/page-content', pageContentRouter);
router.use('/jobs', jobDescriptionRouter);

export default router;

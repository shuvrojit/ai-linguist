import { Router } from 'express';
import featuresRouter from './features.routes';
import pageContentRouter from './pageContent.routes';
import jobDescriptionRouter from './jobDescription.routes';
import scholarshipRouter from './scholarship.routes';
import blogRouter from './blog.routes';
import newsRouter from './news.routes';
import technicalRouter from './technical.routes';
import otherRouter from './other.routes';

const router = Router();

router.use('/features', featuresRouter);
router.use('/page-content', pageContentRouter);
router.use('/jobs', jobDescriptionRouter);
router.use('/scholarships', scholarshipRouter);
router.use('/blogs', blogRouter);
router.use('/news', newsRouter);
router.use('/technical', technicalRouter);
router.use('/other', otherRouter);

export default router;

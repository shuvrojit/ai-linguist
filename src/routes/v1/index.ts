import { Router } from 'express';
import featuresRouter from './features.routes';
import pageContentRouter from './pageContent.routes';
import jobDescriptionRouter from './jobDescription.routes';
import scholarshipRouter from './scholarship.routes';
import blogRouter from './blog.routes';
import newsRouter from './news.routes';
import technicalRouter from './technical.routes';
import otherRouter from './other.routes';
import admissionRouter from './admission.routes';
import fileRouter from './file.routes';
import userRouter from './user.routes';

const router = Router();

router.use('/users', userRouter);
router.use('/features', featuresRouter);
router.use('/page-content', pageContentRouter);
router.use('/jobs', jobDescriptionRouter);
router.use('/scholarships', scholarshipRouter);
router.use('/admissions', admissionRouter);
router.use('/blogs', blogRouter);
router.use('/news', newsRouter);
router.use('/file', fileRouter);
router.use('/technical', technicalRouter);
router.use('/other', otherRouter);

export default router;

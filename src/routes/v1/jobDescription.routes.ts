import { Router } from 'express';
import {
  createJobDescription,
  getJobDescriptionById,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptions,
  getActiveJobs,
} from '../../controllers/jobDescription.controller';

const router = Router();

router.route('/').post(createJobDescription).get(getJobDescriptions);

router.route('/active').get(getActiveJobs);

router
  .route('/:id')
  .get(getJobDescriptionById)
  .patch(updateJobDescription)
  .delete(deleteJobDescription);

export default router;

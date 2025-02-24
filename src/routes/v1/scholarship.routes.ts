import { Router } from 'express';
import {
  createScholarship,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  getScholarships,
  getActiveScholarships,
  getScholarshipsByCountry,
} from '../../controllers/scholarship.controller';

const router = Router();

router.route('/').post(createScholarship).get(getScholarships);

router.route('/active').get(getActiveScholarships);

router.route('/country/:country').get(getScholarshipsByCountry);

router
  .route('/:id')
  .get(getScholarshipById)
  .patch(updateScholarship)
  .delete(deleteScholarship);

export default router;

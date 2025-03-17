import { Router } from 'express';
import {
  createAdmission,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  getAdmissions,
  getAdmissionsByUniversity,
  getAdmissionsByDegree,
  getUpcomingDeadlineAdmissions,
} from '../../controllers/admission.controller';

const router = Router();

router.route('/').post(createAdmission).get(getAdmissions);

router.route('/upcoming-deadlines').get(getUpcomingDeadlineAdmissions);

router.route('/university/:university').get(getAdmissionsByUniversity);

router.route('/degree/:degree').get(getAdmissionsByDegree);

router
  .route('/:id')
  .get(getAdmissionById)
  .patch(updateAdmission)
  .delete(deleteAdmission);

export default router;

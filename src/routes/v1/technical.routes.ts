import express from 'express';
import {
  createTechnical,
  getTechnicalById,
  updateTechnical,
  deleteTechnical,
  getTechnical,
  getTechnicalByTechnology,
  getTechnicalByComplexity,
} from '../../controllers/technical.controller';

const router = express.Router();

router.route('/').post(createTechnical).get(getTechnical);

router.route('/technology/:technology').get(getTechnicalByTechnology);

router.route('/complexity/:level').get(getTechnicalByComplexity);

router
  .route('/:id')
  .get(getTechnicalById)
  .patch(updateTechnical)
  .delete(deleteTechnical);

export default router;

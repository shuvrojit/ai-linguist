import express from 'express';
import {
  createOther,
  getOtherById,
  updateOther,
  deleteOther,
  getOthers,
  getOthersByType,
  getOthersByComplexity,
} from '../../controllers/other.controller';

const router = express.Router();

router.route('/').post(createOther).get(getOthers);

router.route('/type/:type').get(getOthersByType);

router.route('/complexity/:level').get(getOthersByComplexity);

router.route('/:id').get(getOtherById).patch(updateOther).delete(deleteOther);

export default router;

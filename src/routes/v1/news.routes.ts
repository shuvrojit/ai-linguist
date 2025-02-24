import express from 'express';
import {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
  getNews,
  getBreakingNews,
  getNewsByCategory,
} from '../../controllers/news.controller';

const router = express.Router();

router.route('/').post(createNews).get(getNews);

router.route('/breaking').get(getBreakingNews);

router.route('/category/:category').get(getNewsByCategory);

router.route('/:id').get(getNewsById).patch(updateNews).delete(deleteNews);

export default router;

import express from 'express';
import {
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogs,
} from '../../controllers/blog.controller';

const router = express.Router();

router.route('/').post(createBlog).get(getBlogs);

router.route('/:id').get(getBlogById).patch(updateBlog).delete(deleteBlog);

export default router;

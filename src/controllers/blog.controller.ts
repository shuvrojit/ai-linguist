import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new blog entry
 *
 * @route POST /api/v1/blogs
 * @access Public
 */
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.createBlog(req.body);
  res.status(201).json(blog);
});

/**
 * Get blog by ID
 *
 * @route GET /api/v1/blogs/:id
 * @access Public
 */
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.getBlogById(req.params.id);
  res.status(200).json(blog);
});

/**
 * Update blog by ID
 *
 * @route PATCH /api/v1/blogs/:id
 * @access Public
 */
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const blog = await blogService.updateBlogById(req.params.id, req.body);
  res.status(200).json(blog);
});

/**
 * Delete blog by ID
 *
 * @route DELETE /api/v1/blogs/:id
 * @access Public
 */
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  await blogService.deleteBlogById(req.params.id);
  res.status(204).send();
});

/**
 * Get all blogs with filtering, sorting, and pagination
 *
 * @route GET /api/v1/blogs
 * @access Public
 */
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, any> = {};
  const options = {
    limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  // Add filters based on query parameters
  if (req.query.sentiment) {
    filter['sentiment'] = req.query.sentiment;
  }
  if (req.query.complexity) {
    filter['complexity'] = req.query.complexity;
  }
  if (req.query.tag) {
    filter['tags'] = { $in: [req.query.tag] };
  }

  const result = await blogService.getBlogs(filter, options);
  res.status(200).json(result);
});

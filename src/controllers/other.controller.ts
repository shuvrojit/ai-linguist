import { Request, Response } from 'express';
import * as otherService from '../services/other.service';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

/**
 * Create a new other content entry
 *
 * @route POST /api/v1/other
 * @access Public
 */
export const createOther = asyncHandler(async (req: Request, res: Response) => {
  const other = await otherService.createOther(req.body);
  res.status(201).json(other);
});

/**
 * Get other content by ID
 *
 * @route GET /api/v1/other/:id
 * @access Public
 */
export const getOtherById = asyncHandler(
  async (req: Request, res: Response) => {
    const other = await otherService.getOtherById(req.params.id);
    res.status(200).json(other);
  }
);

/**
 * Update other content by ID
 *
 * @route PATCH /api/v1/other/:id
 * @access Public
 */
export const updateOther = asyncHandler(async (req: Request, res: Response) => {
  const other = await otherService.updateOtherById(req.params.id, req.body);
  res.status(200).json(other);
});

/**
 * Delete other content by ID
 *
 * @route DELETE /api/v1/other/:id
 * @access Public
 */
export const deleteOther = asyncHandler(async (req: Request, res: Response) => {
  await otherService.deleteOtherById(req.params.id);
  res.status(204).send();
});

/**
 * Get all other content with filtering, sorting, and pagination
 *
 * @route GET /api/v1/other
 * @access Public
 */
export const getOthers = asyncHandler(async (req: Request, res: Response) => {
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
  if (req.query.content_type) {
    filter['content_type'] = req.query.content_type;
  }

  const result = await otherService.getOthers(filter, options);
  res.status(200).json(result);
});

/**
 * Get other content by type
 *
 * @route GET /api/v1/other/type/:type
 * @access Public
 */
export const getOthersByType = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await otherService.getOthersByType(req.params.type, options);
    res.status(200).json(result);
  }
);

/**
 * Get other content by complexity
 *
 * @route GET /api/v1/other/complexity/:level
 * @access Public
 */
export const getOthersByComplexity = asyncHandler(
  async (req: Request, res: Response) => {
    const level = req.params.level as 'basic' | 'intermediate' | 'advanced';
    if (!['basic', 'intermediate', 'advanced'].includes(level)) {
      throw new ApiError(400, 'Invalid complexity level');
    }

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await otherService.getOthersByComplexity(level, options);
    res.status(200).json(result);
  }
);

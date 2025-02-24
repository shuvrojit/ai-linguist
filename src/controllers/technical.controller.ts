import { Request, Response } from 'express';
import * as technicalService from '../services/technical.service';
import { asyncHandler } from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';

/**
 * Create a new technical document
 *
 * @route POST /api/v1/technical
 * @access Public
 */
export const createTechnical = asyncHandler(
  async (req: Request, res: Response) => {
    const technical = await technicalService.createTechnical(req.body);
    res.status(201).json(technical);
  }
);

/**
 * Get technical document by ID
 *
 * @route GET /api/v1/technical/:id
 * @access Public
 */
export const getTechnicalById = asyncHandler(
  async (req: Request, res: Response) => {
    const technical = await technicalService.getTechnicalById(req.params.id);
    res.status(200).json(technical);
  }
);

/**
 * Update technical document by ID
 *
 * @route PATCH /api/v1/technical/:id
 * @access Public
 */
export const updateTechnical = asyncHandler(
  async (req: Request, res: Response) => {
    const technical = await technicalService.updateTechnicalById(
      req.params.id,
      req.body
    );
    res.status(200).json(technical);
  }
);

/**
 * Delete technical document by ID
 *
 * @route DELETE /api/v1/technical/:id
 * @access Public
 */
export const deleteTechnical = asyncHandler(
  async (req: Request, res: Response) => {
    await technicalService.deleteTechnicalById(req.params.id);
    res.status(204).send();
  }
);

/**
 * Get all technical documents with filtering, sorting, and pagination
 *
 * @route GET /api/v1/technical
 * @access Public
 */
export const getTechnical = asyncHandler(
  async (req: Request, res: Response) => {
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
      filter['complexity_level'] = req.query.complexity;
    }
    if (req.query.tag) {
      filter['tags'] = { $in: [req.query.tag] };
    }
    if (req.query.technology) {
      filter['technology'] = req.query.technology;
    }
    if (req.query.content_type) {
      filter['content_type'] = req.query.content_type;
    }

    const result = await technicalService.getTechnical(filter, options);
    res.status(200).json(result);
  }
);

/**
 * Get technical documents by technology
 *
 * @route GET /api/v1/technical/technology/:technology
 * @access Public
 */
export const getTechnicalByTechnology = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await technicalService.getTechnicalByTechnology(
      req.params.technology,
      options
    );
    res.status(200).json(result);
  }
);

/**
 * Get technical documents by complexity level
 *
 * @route GET /api/v1/technical/complexity/:level
 * @access Public
 */
export const getTechnicalByComplexity = asyncHandler(
  async (req: Request, res: Response) => {
    const level = req.params.level as 'beginner' | 'intermediate' | 'advanced';
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      throw new ApiError(400, 'Invalid complexity level');
    }

    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await technicalService.getTechnicalByComplexity(
      level,
      options
    );
    res.status(200).json(result);
  }
);

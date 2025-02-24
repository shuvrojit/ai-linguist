import { Request, Response } from 'express';
import * as scholarshipService from '../services/scholarship.service';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new scholarship entry
 *
 * @route POST /api/v1/scholarships
 * @access Public
 */
export const createScholarship = asyncHandler(
  async (req: Request, res: Response) => {
    const scholarship = await scholarshipService.createScholarship(req.body);
    res.status(201).json(scholarship);
  }
);

/**
 * Get scholarship by ID
 *
 * @route GET /api/v1/scholarships/:id
 * @access Public
 */
export const getScholarshipById = asyncHandler(
  async (req: Request, res: Response) => {
    const scholarship = await scholarshipService.getScholarshipById(
      req.params.id
    );
    res.status(200).json(scholarship);
  }
);

/**
 * Update scholarship by ID
 *
 * @route PATCH /api/v1/scholarships/:id
 * @access Public
 */
export const updateScholarship = asyncHandler(
  async (req: Request, res: Response) => {
    const scholarship = await scholarshipService.updateScholarshipById(
      req.params.id,
      req.body
    );
    res.status(200).json(scholarship);
  }
);

/**
 * Delete scholarship by ID
 *
 * @route DELETE /api/v1/scholarships/:id
 * @access Public
 */
export const deleteScholarship = asyncHandler(
  async (req: Request, res: Response) => {
    await scholarshipService.deleteScholarshipById(req.params.id);
    res.status(204).send();
  }
);

/**
 * Get all scholarships with filtering, sorting, and pagination
 *
 * @route GET /api/v1/scholarships
 * @access Public
 */
export const getScholarships = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, any> = {};
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    // Add filters based on query parameters
    if (req.query.status) {
      filter['status'] = req.query.status;
    }
    if (req.query.country) {
      filter['country'] = req.query.country;
    }
    if (req.query.degree_level) {
      filter['degree_level'] = { $in: [req.query.degree_level] };
    }
    if (req.query.field_of_study) {
      filter['field_of_study'] = { $in: [req.query.field_of_study] };
    }

    const result = await scholarshipService.getScholarships(filter, options);
    res.status(200).json(result);
  }
);

/**
 * Get active scholarships
 *
 * @route GET /api/v1/scholarships/active
 * @access Public
 */
export const getActiveScholarships = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await scholarshipService.getActiveScholarships(options);
    res.status(200).json(result);
  }
);

/**
 * Get scholarships by country
 *
 * @route GET /api/v1/scholarships/country/:country
 * @access Public
 */
export const getScholarshipsByCountry = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await scholarshipService.getScholarshipsByCountry(
      req.params.country,
      options
    );
    res.status(200).json(result);
  }
);

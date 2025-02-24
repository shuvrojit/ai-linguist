import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import * as jobDescriptionService from '../services/jobDescription.service';

/**
 * Create a new job description
 *
 * @route POST /api/v1/jobs
 * @access Public
 */
export const createJobDescription = asyncHandler(
  async (req: Request, res: Response) => {
    const jobDescription = await jobDescriptionService.createJobDescription(
      req.body
    );
    res.status(201).json(jobDescription);
  }
);

/**
 * Get job description by ID
 *
 * @route GET /api/v1/jobs/:id
 * @access Public
 */
export const getJobDescriptionById = asyncHandler(
  async (req: Request, res: Response) => {
    const jobDescription = await jobDescriptionService.getJobDescriptionById(
      req.params.id
    );
    res.status(200).json(jobDescription);
  }
);

/**
 * Update job description by ID
 *
 * @route PATCH /api/v1/jobs/:id
 * @access Public
 */
export const updateJobDescription = asyncHandler(
  async (req: Request, res: Response) => {
    const jobDescription = await jobDescriptionService.updateJobDescriptionById(
      req.params.id,
      req.body
    );
    res.status(200).json(jobDescription);
  }
);

/**
 * Delete job description by ID
 *
 * @route DELETE /api/v1/jobs/:id
 * @access Public
 */
export const deleteJobDescription = asyncHandler(
  async (req: Request, res: Response) => {
    await jobDescriptionService.deleteJobDescriptionById(req.params.id);
    res.status(204).send();
  }
);

/**
 * Get all job descriptions with filtering, sorting, and pagination
 *
 * @route GET /api/v1/jobs
 * @access Public
 */
export const getJobDescriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, any> = {};
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    // Add filters based on query parameters
    if (req.query.status) {
      filter['status'] = req.query.status;
    }
    if (req.query.job_type) {
      filter['job_type'] = req.query.job_type;
    }
    if (req.query.workplace) {
      filter['workplace'] = req.query.workplace;
    }
    if (req.query.tech_stack) {
      filter['tech_stack'] = { $in: [req.query.tech_stack] };
    }
    if (req.query.min_experience) {
      filter['professional_experience'] = {
        $gte: parseInt(req.query.min_experience as string, 10),
      };
    }

    const result = await jobDescriptionService.getJobDescriptions(
      filter,
      options
    );
    res.status(200).json(result);
  }
);

/**
 * Get active job descriptions
 *
 * @route GET /api/v1/jobs/active
 * @access Public
 */
export const getActiveJobs = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: (req.query.sortBy as string) || 'createdAt',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const result = await jobDescriptionService.getActiveJobs(options);
    res.status(200).json(result);
  }
);

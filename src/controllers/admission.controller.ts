import { Request, Response } from 'express';
import * as admissionService from '../services/admission.service';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Create a new admission entry
 *
 * @route POST /api/v1/admissions
 * @access Public
 */
export const createAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    const admission = await admissionService.createAdmission(req.body);
    res.status(201).json(admission);
  }
);

/**
 * Get admission by ID
 *
 * @route GET /api/v1/admissions/:id
 * @access Public
 */
export const getAdmissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const admission = await admissionService.getAdmissionById(req.params.id);
    res.status(200).json(admission);
  }
);

/**
 * Update admission by ID
 *
 * @route PATCH /api/v1/admissions/:id
 * @access Public
 */
export const updateAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    const admission = await admissionService.updateAdmissionById(
      req.params.id,
      req.body
    );
    res.status(200).json(admission);
  }
);

/**
 * Delete admission by ID
 *
 * @route DELETE /api/v1/admissions/:id
 * @access Public
 */
export const deleteAdmission = asyncHandler(
  async (req: Request, res: Response) => {
    await admissionService.deleteAdmissionById(req.params.id);
    res.status(204).send();
  }
);

/**
 * Get all admissions with filtering, sorting, and pagination
 *
 * @route GET /api/v1/admissions
 * @access Public
 */
export const getAdmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, any> = {};
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    // Add filters based on query parameters
    if (req.query.university) {
      filter['university'] = req.query.university;
    }
    if (req.query.degree) {
      filter['degree'] = req.query.degree;
    }
    if (req.query.languageOfInstruction) {
      filter['languageOfInstruction'] = req.query.languageOfInstruction;
    }

    const result = await admissionService.getAdmissions(filter, options);
    res.status(200).json(result);
  }
);

/**
 * Get admissions by university
 *
 * @route GET /api/v1/admissions/university/:university
 * @access Public
 */
export const getAdmissionsByUniversity = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await admissionService.getAdmissionsByUniversity(
      req.params.university,
      options
    );
    res.status(200).json(result);
  }
);

/**
 * Get admissions by degree
 *
 * @route GET /api/v1/admissions/degree/:degree
 * @access Public
 */
export const getAdmissionsByDegree = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await admissionService.getAdmissionsByDegree(
      req.params.degree,
      options
    );
    res.status(200).json(result);
  }
);

/**
 * Get admissions with upcoming deadlines
 *
 * @route GET /api/v1/admissions/upcoming-deadlines
 * @access Public
 */
export const getUpcomingDeadlineAdmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const options = {
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      sortBy: (req.query.sortBy as string) || 'applicationDeadline',
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    };

    const result =
      await admissionService.getUpcomingDeadlineAdmissions(options);
    res.status(200).json(result);
  }
);
